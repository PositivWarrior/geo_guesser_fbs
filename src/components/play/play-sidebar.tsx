'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Compass } from '@/components/icons';
import { PLAY_NAV_ITEMS } from '@/lib/play-nav';
import { getPlayerProgress } from '@/lib/arena-stats';

type PlaySidebarProps = {
	className?: string;
};

export function PlaySidebar({ className }: PlaySidebarProps) {
	const pathname = usePathname();
	const { level, rank } = getPlayerProgress();

	return (
		<aside
			className={cn(
				'w-[5.5rem] lg:w-48 xl:w-52 shrink-0 flex flex-col border-r border-white/10 bg-[#050a10]/95',
				className,
			)}
		>
			<nav className="flex-1 flex flex-col gap-0.5 p-2 lg:p-3 pt-4">
				{PLAY_NAV_ITEMS.map(({ href, label, icon: Icon, activeWhen }) => {
					const isActive = activeWhen(pathname);

					return (
						<Link
							key={href}
							href={href}
							className={cn(
								'flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-3 rounded-xl px-2 lg:px-3 py-2.5 text-center lg:text-left transition-all',
								isActive
									? 'bg-primary/15 text-primary border border-primary/35 shadow-[0_0_20px_hsl(var(--primary)/0.25)]'
									: 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent',
							)}
							title={label}
						>
							<Icon
								className={cn(
									'h-5 w-5 shrink-0',
									isActive && 'drop-shadow-[0_0_8px_hsl(var(--primary))]',
								)}
							/>
							<span className="text-[9px] lg:text-sm font-medium leading-tight lg:leading-normal">
								{label}
							</span>
						</Link>
					);
				})}
			</nav>

			<div className="p-2 lg:p-3 pb-4 border-t border-white/10">
				<div className="flex flex-col lg:flex-row items-center gap-2 rounded-xl game-panel p-2 lg:p-3 border-primary/20">
					<span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 border border-primary/40 shadow-[0_0_16px_hsl(var(--primary)/0.35)]">
						<Compass className="h-5 w-5 text-primary" />
					</span>
					<div className="text-center lg:text-left min-w-0">
						<p className="text-[10px] lg:text-xs text-primary font-bold">
							Lv. {level}
						</p>
						<p className="text-[9px] lg:text-sm font-semibold text-foreground truncate max-w-[4rem] lg:max-w-none">
							{rank}
						</p>
					</div>
				</div>
			</div>
		</aside>
	);
}
