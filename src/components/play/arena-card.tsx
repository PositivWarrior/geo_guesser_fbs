'use client';

import Image from 'next/image';
import type { Continent } from '@/lib/continents';
import type { ContinentAccess } from '@/lib/entitlements';
import type { LockReason } from '@/lib/entitlements';
import {
	getArenaMeta,
	formatArenaDuration,
} from '@/lib/arena-meta';
import { getArenaPersonalStats } from '@/lib/arena-stats';
import { cn } from '@/lib/utils';
import { Timer, MapPin, Lock, LogIn, Coffee } from 'lucide-react';

type ArenaCardProps = {
	continent: Continent;
	access: ContinentAccess;
	recommended?: boolean;
	onClick: () => void;
};

export function ArenaCard({
	continent,
	access,
	recommended,
	onClick,
}: ArenaCardProps) {
	const meta = getArenaMeta(continent.id);
	const Icon = continent.icon;
	const locked = !access.canPlay;
	const stats = getArenaPersonalStats(continent.id);
	const duration = formatArenaDuration(continent.time);

	const playLabel = locked
		? access.lockReason === 'auth'
			? 'Sign in'
			: access.lockReason === 'americas' || access.lockReason === 'africa'
				? 'Unlock'
				: 'Locked'
		: 'Play';

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'group relative flex flex-col w-full h-full min-h-[20rem] lg:min-h-[22rem] xl:min-h-[24rem] rounded-2xl overflow-hidden border-2 text-left transition-all duration-300',
				meta.border,
				!locked && meta.glow,
				!locked && 'hover:-translate-y-1 hover:scale-[1.01]',
				locked && 'opacity-90',
			)}
		>
			<Image
				src={meta.bgImage}
				alt=""
				fill
				className="object-cover transition-transform duration-500 group-hover:scale-105"
				sizes="(max-width: 640px) 100vw, 25vw"
				priority={recommended}
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-[#050a10] via-[#050a10]/75 to-[#050a10]/20" />
			<div
				className={cn(
					'absolute inset-0 opacity-40 mix-blend-color',
					continent.id === 'europe' && 'bg-primary/30',
					continent.id === 'asia-oceania' && 'bg-secondary/30',
					continent.id === 'americas' && 'bg-violet-600/25',
					continent.id === 'africa' && 'bg-accent/25',
				)}
			/>

			<div className="relative z-10 flex flex-col flex-1 p-3 lg:p-4">
				{recommended && !locked ? (
					<span className="self-center text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary text-primary-foreground mb-2 shadow-[0_0_12px_hsl(var(--primary)/0.5)]">
						Recommended
					</span>
				) : (
					<span className="h-4 mb-2" />
				)}

				<div
					className={cn(
						'mx-auto flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full border-2 mb-3 shadow-lg',
						meta.iconRing,
					)}
				>
					<Icon className="h-6 w-6 lg:h-7 lg:w-7" />
				</div>

				<h3 className="font-headline font-bold text-base lg:text-lg text-center text-foreground mb-2 leading-tight">
					{continent.name}
				</h3>

				<div className="flex justify-center gap-3 text-[10px] lg:text-xs text-muted-foreground mb-3">
					<span className="inline-flex items-center gap-1">
						<Timer className="h-3.5 w-3.5" />
						{duration}
					</span>
					<span className="inline-flex items-center gap-1">
						<MapPin className="h-3.5 w-3.5" />
						{meta.countryCount} Countries
					</span>
				</div>

				<div className="grid grid-cols-2 gap-1.5 mb-3 text-center">
					<StatBox label="Best time" value={stats.bestTime ?? '--:--'} highlight={!!stats.bestTime} />
					<StatBox
						label="Accuracy"
						value={stats.accuracy ?? '--'}
						highlight={!!stats.accuracy}
					/>
				</div>

				<div className="mt-auto pt-1">
					<span
						className={cn(
							'flex w-full items-center justify-center gap-2 h-10 lg:h-11 rounded-xl font-bold uppercase tracking-wider text-xs lg:text-sm transition-transform group-hover:scale-[1.02] shadow-lg',
							locked
								? 'bg-muted/50 text-muted-foreground border border-white/10'
								: meta.button,
						)}
					>
						{locked && <LockIcon reason={access.lockReason} />}
						{playLabel}
					</span>
				</div>
			</div>

			{locked && (
				<div className="absolute inset-0 z-20 bg-background/40 backdrop-blur-[1px] pointer-events-none" />
			)}
		</button>
	);
}

function StatBox({
	label,
	value,
	highlight,
}: {
	label: string;
	value: string;
	highlight?: boolean;
}) {
	return (
		<div className="rounded-lg bg-black/35 border border-white/10 px-2 py-2">
			<p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">
				{label}
			</p>
			<p
				className={cn(
					'text-sm font-bold tabular-nums',
					highlight ? 'text-primary' : 'text-muted-foreground',
				)}
			>
				{value}
			</p>
		</div>
	);
}

function LockIcon({ reason }: { reason: LockReason }) {
	if (reason === 'auth') return <LogIn className="h-4 w-4" />;
	if (reason === 'americas' || reason === 'africa')
		return <Coffee className="h-4 w-4" />;
	return <Lock className="h-4 w-4" />;
}
