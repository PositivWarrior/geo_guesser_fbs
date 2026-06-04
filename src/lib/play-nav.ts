import type { LucideIcon } from 'lucide-react';
import {
	Home,
	Package,
	Trophy,
	Award,
	BarChart3,
} from 'lucide-react';

export type PlayNavItem = {
	href: string;
	label: string;
	icon: LucideIcon;
	/** Pathname prefixes that mark this item active (first match wins) */
	activeWhen: (pathname: string) => boolean;
};

export const PLAY_NAV_ITEMS: PlayNavItem[] = [
	{
		href: '/play',
		label: 'Home',
		icon: Home,
		activeWhen: (p) => p === '/play',
	},
	{
		href: '/play/missions',
		label: 'Missions',
		icon: Package,
		activeWhen: (p) => p.startsWith('/play/missions'),
	},
	{
		href: '/leaderboard',
		label: 'Leaderboard',
		icon: Trophy,
		activeWhen: (p) => p.startsWith('/leaderboard'),
	},
	{
		href: '/play/achievements',
		label: 'Achievements',
		icon: Award,
		activeWhen: (p) => p.startsWith('/play/achievements'),
	},
	{
		href: '/play/stats',
		label: 'Stats',
		icon: BarChart3,
		activeWhen: (p) => p.startsWith('/play/stats'),
	},
];

export function getActivePlayNavItem(pathname: string): PlayNavItem | undefined {
	return PLAY_NAV_ITEMS.find((item) => item.activeWhen(pathname));
}
