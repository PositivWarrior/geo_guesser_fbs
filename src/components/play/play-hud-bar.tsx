'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Compass } from '@/components/icons';
import { AuthButton } from '@/components/auth-button';
import { getPlayerProgress } from '@/lib/arena-stats';
import { cn } from '@/lib/utils';
import {
	Zap,
	Gem,
	Calendar,
	Bell,
	Settings,
	Plus,
} from 'lucide-react';

export function PlayHudBar() {
	const { level, rank, xp, xpToNext } = getPlayerProgress();
	const xpPct = Math.min(100, Math.round((xp / xpToNext) * 100));

	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-[#060c14]/95 backdrop-blur-xl">
			<div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2.5 min-h-[3.25rem]">
				<Link
					href="/play"
					className="flex items-center gap-2 shrink-0 font-headline font-bold text-sm sm:text-base"
				>
					<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/35 shadow-[0_0_16px_hsl(var(--primary)/0.25)]">
						<Compass className="h-5 w-5 text-primary" />
					</span>
					<span className="hidden sm:inline">
						Geo<span className="text-primary">Guesser</span>
					</span>
				</Link>

				{/* XP bar — grows on md+ */}
				<div className="hidden md:flex flex-1 items-center gap-3 min-w-0 max-w-xl">
					<div className="flex items-center gap-2 shrink-0">
						<span className="text-[10px] font-bold uppercase tracking-wider text-primary px-1.5 py-0.5 rounded bg-primary/15 border border-primary/30">
							Lv.{level}
						</span>
						<span className="text-xs font-semibold text-foreground hidden lg:inline">
							{rank}
						</span>
					</div>
					<div className="flex-1 min-w-[8rem]">
						<div className="h-2 rounded-full bg-muted/50 overflow-hidden border border-white/5">
							<div
								className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)] transition-all"
								style={{ width: `${xpPct}%` }}
							/>
						</div>
						<p className="text-[9px] text-muted-foreground mt-0.5 tabular-nums">
							{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP
						</p>
					</div>
				</div>

				<div className="flex-1 md:flex-none" />

				{/* Resources — decorative */}
				<div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
					<ResourcePill
						icon={<Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400/30" />}
						label="5/5"
						sublabel="Energy"
						className="hidden min-[400px]:flex"
					/>
					<ResourcePill
						icon={<Gem className="h-3.5 w-3.5 text-primary" />}
						label="1,250"
						sublabel="Gems"
						className="hidden sm:flex"
					/>
					<ButtonIcon icon={Calendar} label="Events" />
					<ButtonIcon icon={Bell} label="Notifications" dot />
					<ButtonIcon icon={Settings} label="Settings" className="hidden sm:flex" />
					<AuthButton showLabel={false} className="h-8 w-8 sm:h-9 sm:w-auto" />
				</div>
			</div>

			{/* Mobile XP strip */}
			<div className="md:hidden px-3 pb-2">
				<div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
					<div
						className="h-full bg-primary rounded-full"
						style={{ width: `${xpPct}%` }}
					/>
				</div>
			</div>
		</header>
	);
}

function ResourcePill({
	icon,
	label,
	sublabel,
	className,
}: {
	icon: ReactNode;
	label: string;
	sublabel: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				'flex items-center gap-1.5 rounded-lg game-panel px-2 py-1 border-white/10',
				className,
			)}
		>
			{icon}
			<div className="text-left leading-none">
				<p className="text-xs font-bold tabular-nums">{label}</p>
				<p className="text-[8px] text-muted-foreground uppercase">{sublabel}</p>
			</div>
			<button
				type="button"
				className="ml-0.5 h-5 w-5 rounded bg-white/10 flex items-center justify-center text-muted-foreground hover:text-primary"
				aria-label={`Add ${sublabel}`}
			>
				<Plus className="h-3 w-3" />
			</button>
		</div>
	);
}

function ButtonIcon({
	icon: Icon,
	label,
	dot,
	className,
}: {
	icon: React.ElementType;
	label: string;
	dot?: boolean;
	className?: string;
}) {
	return (
		<button
			type="button"
			className={cn(
				'relative h-8 w-8 rounded-lg game-panel flex items-center justify-center text-muted-foreground hover:text-foreground',
				className,
			)}
			aria-label={label}
		>
			<Icon className="h-4 w-4" />
			{dot && (
				<span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary border border-background" />
			)}
		</button>
	);
}
