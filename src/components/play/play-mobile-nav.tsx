'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PLAY_NAV_ITEMS } from '@/lib/play-nav';

export function PlayMobileNav() {
	const pathname = usePathname();

	return (
		<nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-[#050a10]/98 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
			<div className="flex items-stretch justify-around px-0.5 py-1.5">
				{PLAY_NAV_ITEMS.map(({ href, label, icon: Icon, activeWhen }) => {
					const active = activeWhen(pathname);
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								'flex flex-1 flex-col items-center justify-center gap-0.5 py-1 rounded-lg min-w-0 px-0.5',
								active
									? 'text-primary'
									: 'text-muted-foreground',
							)}
						>
							<Icon
								className={cn(
									'h-5 w-5 shrink-0',
									active &&
										'drop-shadow-[0_0_10px_hsl(var(--primary))]',
								)}
							/>
							<span className="text-[8px] font-semibold truncate w-full text-center leading-none">
								{label === 'Leaderboard' ? 'Ranks' : label === 'Achievements' ? 'Awards' : label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
