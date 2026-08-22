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
	avatar: string;
	links: MemberLinks;
}

export interface MemberView extends Member {
	avatarSrc: string;
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
