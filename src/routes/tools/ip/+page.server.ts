import type { PageServerLoad } from './$types';
import { classify, family, isAddress } from './classify';

const INTERESTING = [
	'user-agent',
	'accept-language',
	'accept-encoding',
	'sec-ch-ua-platform',
	'sec-ch-ua-mobile',
	'dnt',
	'sec-gpc',
	'referer'
] as const;

const FORWARDING = [
	'x-forwarded-for',
	'x-real-ip',
	'cf-connecting-ip',
	'true-client-ip',
	'x-forwarded-proto',
	'x-forwarded-host'
] as const;

const CLIENT_IP_HEADERS = ['cf-connecting-ip', 'true-client-ip', 'x-real-ip', 'x-forwarded-for'];

function resolveAddress(request: Request, fallback: string): string {
	for (const name of CLIENT_IP_HEADERS) {
		const candidate = (request.headers.get(name) ?? '').split(',')[0].trim();
		if (candidate && isAddress(candidate)) return candidate;
	}
	return fallback;
}

export const load: PageServerLoad = ({ getClientAddress, request, url }) => {
	let peer: string;
	try {
		peer = getClientAddress();
	} catch {
		peer = '';
	}

	const address = resolveAddress(request, peer);

	const pick = (names: readonly string[]) =>
		names
			.map((name) => ({ name, value: request.headers.get(name) ?? '' }))
			.filter((entry) => entry.value !== '');

	return {
		address,
		kind: address ? classify(address) : '',
		family: address ? family(address) : '',
		peer: peer && peer !== address ? peer : '',
		protocol: url.protocol.replace(':', ''),
		host: url.host,
		method: request.method,
		headers: pick(INTERESTING),
		forwarding: pick(FORWARDING)
	};
};
