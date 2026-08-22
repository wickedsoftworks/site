export function classify(address: string): string {
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

export function family(address: string): string {
	return address.includes(':') ? 'IPv6' : 'IPv4';
}

export function isAddress(value: string): boolean {
	if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value))
		return value.split('.').every((part) => Number(part) <= 255);
	return value.includes(':') && /^[0-9a-f:.]+$/i.test(value);
}
