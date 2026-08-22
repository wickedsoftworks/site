import type { Component } from 'svelte';
import Globe from '@lucide/svelte/icons/globe';
import Binary from '@lucide/svelte/icons/binary';
import Hash from '@lucide/svelte/icons/hash';
import KeyRound from '@lucide/svelte/icons/key-round';
import Link from '@lucide/svelte/icons/link';
import Braces from '@lucide/svelte/icons/braces';
import Clock from '@lucide/svelte/icons/clock';
import Key from '@lucide/svelte/icons/key';
import Palette from '@lucide/svelte/icons/palette';
import QrCode from '@lucide/svelte/icons/qr-code';
import Shuffle from '@lucide/svelte/icons/shuffle';

export interface Tool {
	slug: string;
	name: string;
	blurb: string;
	icon: Component;
	server?: boolean;
}

export const tools: Tool[] = [
	{
		slug: 'ip',
		name: 'IP information',
		blurb: 'What this site can see about your connection.',
		icon: Globe,
		server: true
	},
	{
		slug: 'uuid',
		name: 'UUID generator',
		blurb: 'Generate v4 and v7 UUIDs, one or a thousand.',
		icon: Shuffle
	},
	{
		slug: 'base64',
		name: 'Base64',
		blurb: 'Encode and decode Base64, including URL-safe.',
		icon: Binary
	},
	{
		slug: 'hash',
		name: 'Hash generator',
		blurb: 'SHA-1, SHA-256, SHA-384 and SHA-512 digests.',
		icon: Hash
	},
	{
		slug: 'jwt',
		name: 'JWT decoder',
		blurb: 'Read the header and payload of a token.',
		icon: KeyRound
	},
	{
		slug: 'url',
		name: 'URL tools',
		blurb: 'Encode, decode, and break a URL into its parts.',
		icon: Link
	},
	{
		slug: 'json',
		name: 'JSON formatter',
		blurb: 'Format, minify and validate JSON.',
		icon: Braces
	},
	{
		slug: 'timestamp',
		name: 'Timestamp converter',
		blurb: 'Unix time to a date, and back again.',
		icon: Clock
	},
	{
		slug: 'password',
		name: 'Password generator',
		blurb: 'Cryptographically random strings and passphrases.',
		icon: Key
	},
	{
		slug: 'color',
		name: 'Colour converter',
		blurb: 'Convert between hex, RGB, HSL and OKLCH.',
		icon: Palette
	},
	{
		slug: 'qr',
		name: 'QR code',
		blurb: 'Turn text or a link into a QR code you can save.',
		icon: QrCode
	}
];

export function toolBySlug(slug: string): Tool | undefined {
	return tools.find((tool) => tool.slug === slug);
}
