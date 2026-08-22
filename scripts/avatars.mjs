import { readFile, writeFile, mkdir, unlink, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(root, 'src/lib/data/members.json');
const OUT_DIR = path.join(root, 'static/avatars');
const MANIFEST = path.join(OUT_DIR, '.manifest.json');

const SIZE = 256;
const QUALITY = 82;
const FETCH_TIMEOUT_MS = 10_000;

const RECIPE = `webp-${SIZE}-q${QUALITY}-cover-v1`;

async function readManifest() {
	try {
		return JSON.parse(await readFile(MANIFEST, 'utf8'));
	} catch {
		return {};
	}
}

async function fetchImage(url) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
	try {
		const response = await fetch(url, {
			signal: controller.signal,
			redirect: 'follow',
			headers: { 'user-agent': 'wickedsoftworks-site-build' }
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		return Buffer.from(await response.arrayBuffer());
	} finally {
		clearTimeout(timer);
	}
}

async function main() {
	const parsed = JSON.parse(await readFile(SOURCE, 'utf8'));
	const members = parsed.members ?? [];
	await mkdir(OUT_DIR, { recursive: true });

	const manifest = await readManifest();
	const next = {};
	let built = 0;
	let skipped = 0;
	const failures = [];

	for (const member of members) {
		const { id, avatar } = member;
		if (!id) continue;

		const out = path.join(OUT_DIR, `${id}.webp`);

		if (!avatar) {
			failures.push(`${id}: no avatar URL`);
			continue;
		}

		const prior = manifest[id];
		if (prior && prior.avatar === avatar && prior.recipe === RECIPE && existsSync(out)) {
			next[id] = prior;
			skipped++;
			continue;
		}

		try {
			const input = await fetchImage(avatar);
			await sharp(input)
				.resize(SIZE, SIZE, { fit: 'cover', position: 'attention' })
				.webp({ quality: QUALITY })
				.toFile(out);
			next[id] = { avatar, recipe: RECIPE };
			built++;
		} catch (error) {
			failures.push(`${id}: ${error.message}`);
			if (prior && existsSync(out)) next[id] = prior;
		}
	}

	const live = new Set(members.map((m) => m.id));
	for (const file of await readdir(OUT_DIR)) {
		if (!file.endsWith('.webp')) continue;
		if (!live.has(file.replace(/\.webp$/, ''))) {
			await unlink(path.join(OUT_DIR, file));
		}
	}

	await writeFile(MANIFEST, JSON.stringify(next, null, 2) + '\n');

	const summary = [`${built} built`, `${skipped} unchanged`];
	if (failures.length) summary.push(`${failures.length} failed`);
	console.log(`avatars: ${summary.join(', ')}`);
	for (const failure of failures) {
		console.warn(`  ! ${failure}; falling back to initials`);
	}
}

main().catch((error) => {
	console.warn(`avatars: skipped (${error.message})`);
});
