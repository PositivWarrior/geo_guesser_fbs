import type { Continent } from '@/lib/continents';

export type ContinentTier =
	| 'free'
	| 'requires_auth'
	| 'requires_paid'
	| 'requires_ultimate';

export type LockReason = 'auth' | 'americas' | 'africa' | 'ultimate' | null;

export type EntitlementState = {
	isLoggedIn: boolean;
	unlockedAmericas: boolean;
	unlockedAfrica: boolean;
};

export type ContinentAccess = {
	canPlay: boolean;
	tier: ContinentTier;
	lockReason: LockReason;
	label: string;
	paidRegion?: 'americas' | 'africa';
};

export type UltimateRequirement = {
	id: 'asia' | 'americas' | 'africa';
	label: string;
	met: boolean;
};

export const CONTINENT_TIERS: Record<string, ContinentTier> = {
	europe: 'free',
	'asia-oceania': 'requires_auth',
	americas: 'requires_paid',
	africa: 'requires_paid',
	'all-world': 'requires_ultimate',
};

/** Gates that must be cleared before Whole World (Europe is always free). */
export function getUltimateRequirements(
	opts: EntitlementState,
): UltimateRequirement[] {
	return [
		{
			id: 'asia',
			label: 'Sign in — Asia & Oceania',
			met: opts.isLoggedIn,
		},
		{
			id: 'americas',
			label: 'Support — The Americas',
			met: opts.unlockedAmericas,
		},
		{
			id: 'africa',
			label: 'Support — Africa',
			met: opts.unlockedAfrica,
		},
	];
}

export function canPlayUltimateChallenge(opts: EntitlementState): boolean {
	return getUltimateRequirements(opts).every((r) => r.met);
}

export function getContinentAccess(
	continent: Continent,
	opts: EntitlementState,
): ContinentAccess {
	const tier = CONTINENT_TIERS[continent.id] ?? 'requires_paid';

	if (tier === 'free') {
		return { canPlay: true, tier, lockReason: null, label: 'Free' };
	}

	if (tier === 'requires_auth') {
		return {
			canPlay: opts.isLoggedIn,
			tier,
			lockReason: opts.isLoggedIn ? null : 'auth',
			label: opts.isLoggedIn ? 'Unlocked' : 'Sign in',
		};
	}

	if (continent.id === 'all-world') {
		const unlocked = canPlayUltimateChallenge(opts);
		return {
			canPlay: unlocked,
			tier,
			lockReason: unlocked ? null : 'ultimate',
			label: unlocked ? 'Ultimate' : 'Locked',
		};
	}

	if (continent.id === 'americas') {
		const unlocked = opts.unlockedAmericas;
		return {
			canPlay: unlocked,
			tier,
			lockReason: unlocked ? null : 'americas',
			label: unlocked ? 'Unlocked' : 'Support',
			paidRegion: 'americas',
		};
	}

	if (continent.id === 'africa') {
		const unlocked = opts.unlockedAfrica;
		return {
			canPlay: unlocked,
			tier,
			lockReason: unlocked ? null : 'africa',
			label: unlocked ? 'Unlocked' : 'Support',
			paidRegion: 'africa',
		};
	}

	return {
		canPlay: false,
		tier,
		lockReason: null,
		label: 'Locked',
	};
}

export function getLockMessage(lockReason: LockReason): string {
	if (lockReason === 'auth') {
		return 'Sign in with Google to play Asia & Oceania.';
	}
	if (lockReason === 'americas') {
		return 'Support the project on Buy Me a Coffee to unlock The Americas.';
	}
	if (lockReason === 'africa') {
		return 'Support the project on Buy Me a Coffee to unlock Africa.';
	}
	if (lockReason === 'ultimate') {
		return 'Unlock all regions first: sign in, The Americas, and Africa — then take on the Whole World.';
	}
	return '';
}
