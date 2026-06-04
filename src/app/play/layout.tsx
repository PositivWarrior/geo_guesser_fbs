import type { ReactNode } from 'react';
import { GameSessionProvider } from '@/contexts/game-session-context';
import { PlayLobbyShell } from '@/components/play/play-lobby-shell';

export default function PlayLayout({ children }: { children: ReactNode }) {
	return (
		<GameSessionProvider>
			<PlayLobbyShell>{children}</PlayLobbyShell>
		</GameSessionProvider>
	);
}
