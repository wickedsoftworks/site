/**
 * Site-wide content: the projects list and the organization link.
 *
 * Members live in members.json / members.ts. The utilities on /tools are
 * registered in tools.ts.
 *
 * Anything carrying `placeholder: true` is standing in for content that does
 * not exist yet. Every surface reads that flag and marks the item visibly, so
 * nothing ships as a claim by accident.
 */

export const GITHUB_ORG = 'https://github.com/wickedsoftworks';

export type ProjectStatus = 'active' | 'seeking' | 'paused' | 'shipped' | 'planned';

export const STATUS_LABEL: Record<ProjectStatus, string> = {
	active: 'Active',
	seeking: 'Seeking contributors',
	paused: 'Paused',
	shipped: 'Shipped',
	planned: 'Planned'
};

/** Status is carried by a dot and a word. No coloured surfaces. */
export const STATUS_DOT: Record<ProjectStatus, string> = {
	active: 'var(--ok)',
	seeking: 'var(--brand)',
	paused: 'var(--warn)',
	shipped: 'var(--info)',
	planned: 'var(--idle)'
};

export interface Project {
	name: string;
	summary: string;
	status: ProjectStatus;
	tech: string[];
	repo: string | null;
	placeholder: boolean;
}

export const projects: Project[] = [
	{
		name: 'Placeholder Project One',
		summary:
			'Replace with a real project. This entry stands in to show a project carrying a full description, its stack and a link to the code.',
		status: 'active',
		tech: ['TypeScript', 'SvelteKit'],
		repo: GITHUB_ORG,
		placeholder: true
	},
	{
		name: 'Placeholder Project Two',
		summary:
			'A second entry, here to show how a project looking for contributors reads next to one that is already moving.',
		status: 'seeking',
		tech: ['Rust', 'WebAssembly'],
		repo: GITHUB_ORG,
		placeholder: true
	},
	{
		name: 'Placeholder Project Three',
		summary:
			'Work that has been set aside. Paused projects stay listed rather than disappearing, so the record stays honest.',
		status: 'paused',
		tech: ['Go'],
		repo: null,
		placeholder: true
	},
	{
		name: 'Placeholder Project Four',
		summary:
			'Finished work. Shipped projects stay listed, because a collective is judged on what it has delivered as much as on what it is holding.',
		status: 'shipped',
		tech: ['C', 'Make'],
		repo: GITHUB_ORG,
		placeholder: true
	},
	{
		name: 'Placeholder Project Five',
		summary: 'Something agreed but not started. Listed so the intent is public before the code is.',
		status: 'planned',
		tech: [],
		repo: null,
		placeholder: true
	}
];
