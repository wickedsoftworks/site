export const GITHUB_ORG = 'github.com/WickedSoftworks';

export type ProjectStatus = 'active' | 'seeking' | 'paused' | 'shipped' | 'planned';
export const STATUS_LABEL: Record<ProjectStatus, string> = {
	active: 'Active',
	seeking: 'Seeking contributors',
	paused: 'Paused',
	shipped: 'Shipped',
	planned: 'Planned'
};

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
	repo: string;
}

export const projects: Project[] = [
	{
		name: 'evermind',
		summary:
			'The beautiful, sleek, online student planner. Made for students, by students.',
		status: 'paused',
		tech: ['TypeScript', 'Next.js', 'TailwindCSS', 'Supabase', 'Vercel'],
		repo: "https://github.com/WickedSoftworks/evermind"
	},
	{
		name: 'winstro',
		summary:
			'The ultimate, open-source, cross-platform, lightweight, and fast music player.',
		status: 'shipped',
		tech: ['TypeScript', 'Bun', ],
		repo: "https://github.com/WickedSoftworks/winstro"
	},
	{
		name: 'borealis',
		summary:
			'Safely share & locally host your files',
		status: 'planned',
		tech: ['TypeScript', 'Next.js', 'TailwindCSS', 'Docker', 'Prisma'],
		repo: "https://github.com/WickedSoftworks/borealis"
	}
];
