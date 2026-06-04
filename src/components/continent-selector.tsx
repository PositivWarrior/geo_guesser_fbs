'use client';

import { useState, useEffect } from 'react';
import type { Continent } from '@/lib/continents';
import {
	getContinentAccess,
	getUltimateRequirements,
	getLockMessage,
} from '@/lib/entitlements';
import { useAuth, useEntitlementState } from '@/contexts/auth-context';
import { SignInDialog } from '@/components/sign-in-dialog';
import { UnlockContinentDialog } from '@/components/unlock-continent-dialog';
import { ArenaCard } from '@/components/play/arena-card';
import { UltimateArenaCard } from '@/components/play/ultimate-arena-card';
import { ActiveMissionWidget } from '@/components/play/active-mission-widget';
import { useToast } from '@/hooks/use-toast';
import type { PaidRegion } from '@/lib/bmc';

interface ContinentSelectorProps {
	continents: Continent[];
	ultimate: Continent;
	onSelect: (continent: Continent) => void;
}

export function ContinentSelector({
	continents,
	ultimate,
	onSelect,
}: ContinentSelectorProps) {
	const entitlementState = useEntitlementState();
	const { refreshEntitlements } = useAuth();
	const { toast } = useToast();
	const [signInOpen, setSignInOpen] = useState(false);
	const [unlockOpen, setUnlockOpen] = useState(false);
	const [unlockRegion, setUnlockRegion] = useState<PaidRegion>('americas');
	const [pendingContinent, setPendingContinent] = useState<Continent | null>(
		null,
	);

	const ultimateAccess = getContinentAccess(ultimate, entitlementState);
	const ultimateReqs = getUltimateRequirements(entitlementState);

	const handleSelect = (continent: Continent) => {
		const access = getContinentAccess(continent, entitlementState);
		if (access.canPlay) {
			onSelect(continent);
			return;
		}
		if (access.lockReason === 'auth') {
			setPendingContinent(continent);
			setSignInOpen(true);
			return;
		}
		if (access.lockReason === 'americas' || access.lockReason === 'africa') {
			setUnlockRegion(access.lockReason);
			setPendingContinent(continent);
			setUnlockOpen(true);
			return;
		}
		if (access.lockReason === 'ultimate') {
			toast({
				title: 'Whole World locked',
				description: getLockMessage('ultimate'),
			});
		}
	};

	const handleSignInClosed = (open: boolean) => {
		setSignInOpen(open);
		if (!open) setPendingContinent(null);
	};

	useEffect(() => {
		if (!pendingContinent) return;
		const access = getContinentAccess(pendingContinent, entitlementState);
		if (access.canPlay) {
			onSelect(pendingContinent);
			setPendingContinent(null);
			setSignInOpen(false);
			setUnlockOpen(false);
		}
	}, [entitlementState, pendingContinent, onSelect]);

	return (
		<>
			<div className="px-3 sm:px-4 lg:px-5 py-4 sm:py-5 w-full max-w-[100rem] mx-auto">
				{/* Header row */}
				<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5 sm:mb-6">
					<div className="text-center md:text-left animate-landing-fade-up min-w-0">
						<h1 className="font-headline font-bold text-2xl sm:text-3xl lg:text-[2rem] xl:text-4xl uppercase tracking-tight italic leading-[1.1]">
							<span className="text-foreground">Choose your </span>
							<span className="game-headline-accent">arena</span>
						</h1>
						<p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto md:mx-0">
							Conquer regions, earn rewards, and unlock the ultimate
							challenge.
						</p>
					</div>
					<ActiveMissionWidget />
				</div>

				{/* Four regions — single row on desktop (mockup) */}
				<div className="arena-row mb-5 sm:mb-6 animate-landing-fade-up" style={{ animationDelay: '0.08s' }}>
					{continents.map((continent) => {
						const access = getContinentAccess(
							continent,
							entitlementState,
						);
						return (
							<ArenaCard
								key={continent.id}
								continent={continent}
								access={access}
								recommended={continent.id === 'europe'}
								onClick={() => handleSelect(continent)}
							/>
						);
					})}
				</div>

				{/* Ultimate */}
				<div className="animate-landing-fade-up" style={{ animationDelay: '0.12s' }}>
					<UltimateArenaCard
						continent={ultimate}
						access={ultimateAccess}
						requirements={ultimateReqs}
						onClick={() => handleSelect(ultimate)}
					/>
				</div>
			</div>

			<SignInDialog
				open={signInOpen}
				onOpenChange={handleSignInClosed}
				title="Sign in to play"
				description={
					pendingContinent
						? `Asia & Oceania requires Google sign-in. Ready for ${pendingContinent.name}?`
						: undefined
				}
			/>
			<UnlockContinentDialog
				open={unlockOpen}
				onOpenChange={setUnlockOpen}
				region={unlockRegion}
				onUnlocked={async () => {
					const ent = await refreshEntitlements();
					if (pendingContinent) {
						const access = getContinentAccess(pendingContinent, {
							...entitlementState,
							unlockedAmericas: ent.americas,
							unlockedAfrica: ent.africa,
						});
						if (access.canPlay) onSelect(pendingContinent);
					}
				}}
			/>
		</>
	);
}
