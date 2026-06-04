'use client';

import type { ReactNode } from 'react';
import { useGameSession } from '@/contexts/game-session-context';
import { PlayShell } from '@/components/play/play-shell';
import { PlaySidebar } from '@/components/play/play-sidebar';
import { PlayHudBar } from '@/components/play/play-hud-bar';
import { PlayMobileNav } from '@/components/play/play-mobile-nav';
import { cn } from '@/lib/utils';

type PlayLobbyShellProps = {
	children: ReactNode;
};

/** Lobby chrome; hidden during active game (mobile-first play screen) */
export function PlayLobbyShell({ children }: PlayLobbyShellProps) {
	const { inSession } = useGameSession();

	return (
		<PlayShell variant={inSession ? 'game' : 'lobby'}>
			<div
				className={cn(
					'flex w-full',
					inSession ? 'min-h-[100dvh]' : 'min-h-screen',
				)}
			>
				{!inSession && <PlaySidebar className="hidden md:flex" />}

				<div
					className={cn(
						'flex flex-1 flex-col min-w-0',
						inSession ? 'min-h-0 h-full' : 'min-h-screen',
					)}
				>
					{!inSession && <PlayHudBar />}
					<main
						className={cn(
							'flex-1 min-h-0',
							inSession
								? 'overflow-hidden flex flex-col h-full'
								: 'overflow-y-auto overflow-x-hidden pb-[4.5rem] md:pb-4',
						)}
					>
						{children}
					</main>
				</div>
			</div>
			{!inSession && <PlayMobileNav />}
		</PlayShell>
	);
}
