/**
 * The members directory.
 *
 * The content lives in members.json so it can be edited without touching code.
 * This module only adds types and the derived fields the UI needs.
 *
 * Avatars: `avatar` in the JSON is any remote image URL. `scripts/avatars.mjs`
 * fetches it at build time and writes a normalized 256px square to
 * `static/avatars/<id>.webp`, so nothing is requested from a third party when
 * someone visits the site. `avatarSrc` below points at that local file; if the
 * build-time fetch failed there is no file, and the UI falls back to initials.
 */

import raw from './members.json';

export interface MemberLinks {
	github: string;
	website: string;
	email: string;
}

export interface Member {
	id: string;
	name: string;
	handle: string;
	role: string;
	pronouns: string;
	location: string;
	bio: string;
	focus: string[];
	/** The source image, fetched at build time, not requested by the browser. */
	avatar: string;
	links: MemberLinks;
	placeholder: boolean;
}

export interface MemberView extends Member {
	/** Local, build-normalized avatar. */
	avatarSrc: string;
	/** Up to two letters, for the fallback monogram. */
	initials: string;
}

function initialsOf(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return '?';
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const members: MemberView[] = (raw.members as Member[]).map((member) => ({
	...member,
	avatarSrc: `/avatars/${member.id}.webp`,
	initials: initialsOf(member.name)
}));

export function memberById(id: string): MemberView | undefined {
	return members.find((member) => member.id === id);
}
