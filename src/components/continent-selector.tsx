'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Continent } from '@/lib/continents';
import {
	getContinentAccess,
	getUltimateRequirements,
	canPlayUltimateChallenge,
	getLockMessage,
	type LockReason,
} from '@/lib/entitlements';
import { useAuth, useEntitlementState } from '@/contexts/auth-context';
import { SignInDialog } from '@/components/sign-in-dialog';
import { UnlockContinentDialog } from '@/components/unlock-continent-dialog';
import { PlayShell } from '@/components/play/play-shell';
import { PlayNav } from '@/components/play/play-nav';
import { useToast } from '@/hooks/use-toast';
import {
	Lock,
	LogIn,
	Coffee,
	Timer,
	ChevronRight,
	Zap,
	MapPin,
	Globe2,
	Crown,
	Check,
	Sparkles,
} from 'lucide-react';
import type { PaidRegion } from '@/lib/bmc';
import Link from 'next/link';

interface ContinentSelectorProps {
	continents: Continent[];
	ultimate: Continent;
	onSelect: (continent: Continent) => void;
}

function formatDuration(seconds: number): string {
	const m = Math.floor(seconds / 60);
	return `${m} min`;
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
	const ultimateMetCount = ultimateReqs.filter((r) => r.met).length;
	const allRegionsReady = canPlayUltimateChallenge(entitlementState);

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
				title: 'Ultimate challenge locked',
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

	const standardUnlocked = continents.filter(
		(c) => getContinentAccess(c, entitlementState).canPlay,
	).length;
	const totalSelectable = continents.length + (allRegionsReady ? 1 : 0);

	return (
		<PlayShell variant="lobby">
			<PlayNav />

			<div className="px-3 sm:px-4 pb-12 max-w-5xl mx-auto">
				<section className="text-center mb-8 sm:mb-10 animate-landing-fade-up">
					<div className="inline-flex items-center gap-2 landing-glass rounded-full px-4 py-1.5 text-xs sm:text-sm text-primary mb-4">
						<Zap className="h-3.5 w-3.5" />
						<span>
							Mission select · {standardUnlocked}/{continents.length} regions
							{allRegionsReady ? ' · Ultimate ready' : ''}
						</span>
					</div>
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight mb-3">
						<span className="text-foreground">Pick your </span>
						<span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
							arena
						</span>
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
						Name countries before time runs out. Conquer every region to unlock
						the ultimate Whole World run.
					</p>
				</section>

				<div className="landing-glass-strong rounded-3xl p-4 sm:p-6 mb-4 animate-landing-fade-up" style={{ animationDelay: '0.1s' }}>
					<div className="flex items-center justify-between gap-2 mb-4 px-1">
						<h2 className="font-headline font-semibold text-lg flex items-center gap-2">
							<MapPin className="h-5 w-5 text-secondary" />
							Regions
						</h2>
						<span className="text-xs text-muted-foreground landing-glass px-2 py-1 rounded-full">
							Tap to deploy
						</span>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
						{continents.map((continent, i) => {
							const access = getContinentAccess(
								continent,
								entitlementState,
							);
							const Icon = continent.icon;
							return (
								<MissionCard
									key={continent.id}
									continent={continent}
									access={access}
									Icon={Icon}
									index={i}
									onClick={() => handleSelect(continent)}
								/>
							);
						})}
					</div>
				</div>

				{/* Ultimate challenge — full width */}
				<div
					className="mb-6 animate-landing-fade-up"
					style={{ animationDelay: '0.15s' }}
				>
					<div className="flex items-center gap-2 mb-3 px-1">
						<Crown className="h-5 w-5 text-accent" />
						<h2 className="font-headline font-semibold text-lg">
							Ultimate challenge
						</h2>
						<Badge
							variant="outline"
							className="text-[10px] border-accent/40 text-accent ml-auto"
						>
							{ultimateMetCount}/{ultimateReqs.length} cleared
						</Badge>
					</div>

					<UltimateChallengeCard
						continent={ultimate}
						access={ultimateAccess}
						requirements={ultimateReqs}
						onClick={() => handleSelect(ultimate)}
					/>
				</div>

				<div className="landing-glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground animate-landing-fade-up" style={{ animationDelay: '0.2s' }}>
					<p className="text-center sm:text-left">
						<strong className="text-foreground">Europe</strong> is free.
						Unlock Asia, Americas &amp; Africa to earn{' '}
						<strong className="text-accent">Whole World</strong> ({totalSelectable}{' '}
						missions max).
					</p>
					<Button asChild variant="outline" size="sm" className="landing-glass shrink-0">
						<Link href="/leaderboard">View rankings</Link>
					</Button>
				</div>
			</div>

			<SignInDialog
				open={signInOpen}
				onOpenChange={handleSignInClosed}
				title="Sign in to deploy"
				description={
					pendingContinent
						? `Asia & Oceania requires Google sign-in. Ready to play ${pendingContinent.name}?`
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
		</PlayShell>
	);
}

function UltimateChallengeCard({
	continent,
	access,
	requirements,
	onClick,
}: {
	continent: Continent;
	access: ReturnType<typeof getContinentAccess>;
	requirements: ReturnType<typeof getUltimateRequirements>;
	onClick: () => void;
}) {
	const unlocked = access.canPlay;
	const Icon = continent.icon;
	const duration = formatDuration(continent.time);

	return (
		<button
			type="button"
			onClick={onClick}
			className={`group relative w-full text-left rounded-2xl p-5 sm:p-6 transition-all duration-300 border overflow-hidden ${
				unlocked
					? 'bg-gradient-to-r from-accent/25 via-primary/15 to-secondary/20 border-accent/50 hover:border-accent hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5'
					: 'landing-glass-strong border-white/10 opacity-95'
			}`}
		>
			{unlocked && (
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
			)}

			<div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
				<div
					className={`h-16 w-16 sm:h-20 sm:w-20 rounded-2xl flex items-center justify-center shrink-0 border mx-auto sm:mx-0 ${
						unlocked
							? 'bg-accent/20 border-accent/40 shadow-lg shadow-accent/15'
							: 'bg-muted/30 border-white/10'
					}`}
				>
					<Icon
						className={`h-9 w-9 sm:h-10 sm:w-10 ${unlocked ? 'text-accent' : 'text-muted-foreground'}`}
					/>
				</div>

				<div className="flex-1 text-center sm:text-left min-w-0">
					<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
						<span className="font-headline font-bold text-xl sm:text-2xl">
							{continent.name}
						</span>
						<Badge
							className={
								unlocked
									? 'bg-accent/90 text-accent-foreground border-0'
									: 'border-white/20'
							}
						>
							{unlocked ? (
								<span className="flex items-center gap-1">
									<Sparkles className="h-3 w-3" />
									Ultimate
								</span>
							) : (
								'Locked'
							)}
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground mb-3 max-w-xl mx-auto sm:mx-0">
						{unlocked
							? 'Every country on Earth. One timer. For players who conquered all regions.'
							: 'The final test — unlock every region below to earn this mode.'}
					</p>

					<div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-muted-foreground mb-3">
						<span className="inline-flex items-center gap-1 landing-glass px-2.5 py-1 rounded-full">
							<Timer className="h-3.5 w-3.5 text-accent" />
							<span className="font-semibold text-foreground">{duration}</span>
							ultimate run
						</span>
						<span className="inline-flex items-center gap-1 landing-glass px-2.5 py-1 rounded-full">
							<Globe2 className="h-3.5 w-3.5 text-secondary" />
							~195 countries
						</span>
					</div>

					{!unlocked && (
						<ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
							{requirements.map((req) => (
								<li
									key={req.id}
									className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs border ${
										req.met
											? 'bg-primary/10 border-primary/30 text-primary'
											: 'landing-glass border-white/5 text-muted-foreground'
									}`}
								>
									{req.met ? (
										<Check className="h-3.5 w-3.5 shrink-0" />
									) : (
										<Lock className="h-3.5 w-3.5 shrink-0 opacity-60" />
									)}
									<span className="leading-tight">{req.label}</span>
								</li>
							))}
						</ul>
					)}

					{unlocked && (
						<span className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm">
							Deploy ultimate mission
							<ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</span>
					)}
				</div>
			</div>
		</button>
	);
}

function MissionCard({
	continent,
	access,
	Icon,
	index,
	onClick,
}: {
	continent: Continent;
	access: ReturnType<typeof getContinentAccess>;
	Icon: Continent['icon'];
	index: number;
	onClick: () => void;
}) {
	const locked = !access.canPlay;
	const lockReason = access.lockReason as LockReason;
	const duration = formatDuration(continent.time);

	return (
		<button
			type="button"
			onClick={onClick}
			className={`group relative w-full text-left rounded-2xl p-4 sm:p-5 transition-all duration-300 border overflow-hidden ${
				locked
					? 'landing-glass opacity-85 hover:opacity-100 border-white/5'
					: 'bg-gradient-to-br from-primary/20 via-card/60 to-secondary/10 border-primary/40 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/15 hover:-translate-y-0.5'
			}`}
			style={{ animationDelay: `${index * 0.05}s` }}
		>
			{!locked && (
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
			)}

			<div className="flex items-start gap-4 relative z-10">
				<div
					className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
						locked
							? 'bg-muted/40 border-white/5'
							: 'bg-primary/15 border-primary/30 shadow-inner shadow-primary/10'
					}`}
				>
					<Icon
						className={`h-7 w-7 ${locked ? 'text-muted-foreground' : 'text-primary'}`}
					/>
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between gap-2 mb-1">
						<span className="font-headline font-bold text-base sm:text-lg truncate">
							{continent.name}
						</span>
						<Badge
							variant="outline"
							className={`shrink-0 text-[10px] px-2 ${access.tier === 'free' ? 'border-primary/40 text-primary' : ''}`}
						>
							{access.label}
						</Badge>
					</div>

					<div className="flex items-center gap-3 text-xs text-muted-foreground">
						<span className="inline-flex items-center gap-1">
							<Timer className="h-3.5 w-3.5" />
							{duration}
						</span>
						{locked ? (
							<span className="inline-flex items-center gap-1">
								{lockReason === 'auth' && <LogIn className="h-3.5 w-3.5" />}
								{(lockReason === 'americas' || lockReason === 'africa') && (
									<Coffee className="h-3.5 w-3.5 text-accent" />
								)}
								{lockReason === 'auth' && 'Sign in'}
								{(lockReason === 'americas' || lockReason === 'africa') &&
									'Support'}
								{!lockReason && <Lock className="h-3.5 w-3.5" />}
							</span>
						) : (
							<span className="inline-flex items-center gap-1 text-primary font-medium">
								Play
								<ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
							</span>
						)}
					</div>
				</div>
			</div>
		</button>
	);
}
