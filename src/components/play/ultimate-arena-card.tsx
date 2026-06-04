'use client';

import Image from 'next/image';
import type { Continent } from '@/lib/continents';
import type { ContinentAccess } from '@/lib/entitlements';
import type { UltimateRequirement } from '@/lib/entitlements';
import { getArenaMeta, formatArenaDuration } from '@/lib/arena-meta';
import { Leaf, Mountain, LandPlot, Sun, Lock, Globe2, Gem, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const REGION_STEPS = [
	{ id: 'europe', icon: Leaf, met: true },
	{ id: 'asia', icon: Mountain, metKey: 'asia' as const },
	{ id: 'americas', icon: LandPlot, metKey: 'americas' as const },
	{ id: 'africa', icon: Sun, metKey: 'africa' as const },
];

type UltimateArenaCardProps = {
	continent: Continent;
	access: ContinentAccess;
	requirements: UltimateRequirement[];
	onClick: () => void;
};

export function UltimateArenaCard({
	continent,
	access,
	requirements,
	onClick,
}: UltimateArenaCardProps) {
	const meta = getArenaMeta('all-world');
	const unlocked = access.canPlay;
	const duration = formatArenaDuration(continent.time);

	const reqById = Object.fromEntries(requirements.map((r) => [r.id, r.met]));

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'group relative w-full rounded-2xl overflow-hidden border-2 text-left transition-all',
				meta.border,
				meta.glow,
				unlocked ? 'hover:-translate-y-0.5' : 'cursor-pointer',
			)}
		>
			<div className="relative min-h-[11rem] sm:min-h-[10rem]">
				<Image
					src={meta.bgImage}
					alt=""
					fill
					className="object-cover opacity-60"
					sizes="100vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-[#050a10] via-[#050a10]/90 to-[#050a10]/70" />

				<div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-5 sm:p-6">
					<div className="relative shrink-0">
						<div
							className={cn(
								'h-20 w-20 sm:h-24 sm:w-24 rounded-full flex items-center justify-center border-2',
								unlocked
									? 'bg-amber-500/20 border-amber-400/50'
									: 'bg-black/50 border-white/20',
							)}
						>
							{unlocked ? (
								<Globe2 className="h-10 w-10 text-amber-300" />
							) : (
								<Lock className="h-10 w-10 text-muted-foreground" />
							)}
						</div>
						{!unlocked && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="h-16 w-16 rounded-full border border-amber-400/30 animate-landing-pulse-glow" />
							</div>
						)}
					</div>

					<div className="flex-1 text-center sm:text-left min-w-0">
						<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
							<h3 className="font-headline font-bold text-xl sm:text-2xl uppercase tracking-wide">
								Whole World
							</h3>
							<span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
								Legendary
							</span>
						</div>
						<p className="text-sm text-muted-foreground mb-3 max-w-xl">
							The ultimate test. Name countries from every corner of the
							planet.
						</p>
						<div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-muted-foreground">
							<span>~{meta.countryCount} Countries</span>
							<span>·</span>
							<span>{duration}</span>
							<span>·</span>
							<span className="inline-flex items-center gap-1 text-amber-300/90">
								<Zap className="h-3 w-3" />
								2,000 XP
								<Gem className="h-3 w-3 ml-1 text-primary" />
								500 Gems
							</span>
						</div>
					</div>

					{unlocked && (
						<span className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold uppercase text-sm shadow-lg">
							Play
						</span>
					)}
				</div>
			</div>

			{!unlocked && (
				<div className="relative z-10 px-5 pb-5 sm:px-6 sm:pb-6 border-t border-white/10 bg-[#080f18]/90">
					<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center mb-4">
						Complete all regions to unlock
					</p>
					<div className="flex items-center justify-center gap-2 sm:gap-4 max-w-lg mx-auto">
						{REGION_STEPS.map((step, i) => {
							const met =
								step.id === 'europe'
									? true
									: step.metKey
										? reqById[step.metKey]
										: false;
							const Icon = step.icon;
							return (
								<div key={step.id} className="flex items-center gap-2 sm:gap-4">
									<div
										className={cn(
											'h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center border-2 transition-all',
											met
												? 'bg-primary/20 border-primary text-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]'
												: 'bg-muted/30 border-white/15 text-muted-foreground',
										)}
									>
										<Icon className="h-5 w-5" />
									</div>
									{i < REGION_STEPS.length - 1 && (
										<div
											className={cn(
												'w-6 sm:w-10 h-0.5 rounded',
												met ? 'bg-primary/50' : 'bg-white/10',
											)}
										/>
									)}
								</div>
							);
						})}
						<div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center border-2 border-amber-400/30 bg-amber-500/10">
							<Lock className="h-5 w-5 text-amber-400/70" />
						</div>
					</div>
				</div>
			)}
		</button>
	);
}
