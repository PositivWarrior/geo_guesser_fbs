export type ArenaTheme = {
	accent: string;
	accentHsl: string;
	border: string;
	glow: string;
	bgImage: string;
	iconRing: string;
	button: string;
};

/** Display metadata per arena (mockup-aligned) */
export const ARENA_META: Record<string, ArenaTheme & { countryCount: number }> = {
	europe: {
		countryCount: 53,
		accent: 'text-primary',
		accentHsl: 'primary',
		border: 'border-primary/50',
		glow: 'shadow-[0_0_32px_hsl(var(--primary)/0.35)]',
		bgImage:
			'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=600&h=900&fit=crop&q=80',
		iconRing: 'bg-primary/20 border-primary/50 text-primary',
		button: 'game-cta',
	},
	'asia-oceania': {
		countryCount: 49,
		accent: 'text-secondary',
		accentHsl: 'secondary',
		border: 'border-secondary/50',
		glow: 'shadow-[0_0_32px_hsl(var(--secondary)/0.35)]',
		bgImage:
			'https://images.unsplash.com/photo-1493976040374-85c8e912f783?w=600&h=900&fit=crop&q=80',
		iconRing: 'bg-secondary/20 border-secondary/50 text-secondary',
		button:
			'bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-[0_0_24px_hsl(var(--secondary)/0.4)]',
	},
	americas: {
		countryCount: 35,
		accent: 'text-violet-400',
		accentHsl: '270 70% 65%',
		border: 'border-violet-500/50',
		glow: 'shadow-[0_0_32px_rgba(139,92,246,0.35)]',
		bgImage:
			'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=900&fit=crop&q=80',
		iconRing: 'bg-violet-500/20 border-violet-400/50 text-violet-300',
		button:
			'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_24px_rgba(139,92,246,0.45)]',
	},
	africa: {
		countryCount: 54,
		accent: 'text-accent',
		accentHsl: 'accent',
		border: 'border-accent/50',
		glow: 'shadow-[0_0_32px_hsl(var(--accent)/0.35)]',
		bgImage:
			'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=900&fit=crop&q=80',
		iconRing: 'bg-accent/20 border-accent/50 text-accent',
		button:
			'bg-accent hover:bg-accent/90 text-accent-foreground shadow-[0_0_24px_hsl(var(--accent)/0.4)]',
	},
	'all-world': {
		countryCount: 195,
		accent: 'text-amber-300',
		accentHsl: '45 90% 55%',
		border: 'border-amber-400/40',
		glow: 'shadow-[0_0_40px_rgba(251,191,36,0.25)]',
		bgImage:
			'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=500&fit=crop&q=80',
		iconRing: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
		button:
			'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold shadow-[0_0_28px_rgba(251,191,36,0.4)]',
	},
};

export function getArenaMeta(continentId: string) {
	return ARENA_META[continentId] ?? ARENA_META.europe;
}

export function formatArenaDuration(seconds: number): string {
	const m = Math.floor(seconds / 60);
	return `${m} min`;
}

export function formatBestTime(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m}:${s.toString().padStart(2, '0')}`;
}
