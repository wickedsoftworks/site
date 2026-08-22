import type { PageServerLoad } from './$types';

/**
 * The one tool that needs the server: only the server sees the connecting
 * address and the request headers. Nothing is stored and nothing is forwarded
 * to a third party. It reads the request we already received and reports it
 * straight back.
 */

/** Headers worth surfacing, in the order they should be displayed. */
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

/** Proxy headers, shown separately because they explain where the IP came from. */
const FORWARDING = [
	'x-forwarded-for',
	'x-real-ip',
	'cf-connecting-ip',
	'true-client-ip',
	'x-forwarded-proto',
	'x-forwarded-host'
] as const;

function classify(address: string): string {
	if (address === '::1' || address === '127.0.0.1' || address.startsWith('127.')) {
		return 'Loopback: you are on the same machine as the server';
	}
	if (/^10\./.test(address) || /^192\.168\./.test(address)) return 'Private IPv4 range';
	if (/^172\.(1[6-9]|2\d|3[01])\./.test(address)) return 'Private IPv4 range';
	if (/^169\.254\./.test(address)) return 'Link-local IPv4';
	if (address.startsWith('fe80:')) return 'Link-local IPv6';
	if (address.startsWith('fc') || address.startsWith('fd')) return 'Unique local IPv6';
	if (address.includes(':')) return 'Public IPv6';
	if (/^\d{1,3}(\.\d{1,3}){3}$/.test(address)) return 'Public IPv4';
	return 'Unrecognized format';
}

export const load: PageServerLoad = ({ getClientAddress, request, url }) => {
	let address: string;
	try {
		address = getClientAddress();
	} catch {
		// Some adapters cannot determine it (e.g. a prerender pass).
		address = '';
	}

	const pick = (names: readonly string[]) =>
		names
			.map((name) => ({ name, value: request.headers.get(name) ?? '' }))
			.filter((entry) => entry.value !== '');

	return {
		address,
		kind: address ? classify(address) : '',
		family: address ? (address.includes(':') ? 'IPv6' : 'IPv4') : '',
		protocol: url.protocol.replace(':', ''),
		host: url.host,
		method: request.method,
		headers: pick(INTERESTING),
		forwarding: pick(FORWARDING)
	};
};
