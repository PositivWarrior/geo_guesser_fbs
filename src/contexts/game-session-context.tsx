'use client';

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react';

type GameSessionContextValue = {
	inSession: boolean;
	setInSession: (active: boolean) => void;
};

const GameSessionContext = createContext<GameSessionContextValue | null>(null);

export function GameSessionProvider({ children }: { children: ReactNode }) {
	const [inSession, setInSessionState] = useState(false);
	const setInSession = useCallback((active: boolean) => {
		setInSessionState(active);
	}, []);

	const value = useMemo(
		() => ({ inSession, setInSession }),
		[inSession, setInSession],
	);

	return (
		<GameSessionContext.Provider value={value}>
			{children}
		</GameSessionContext.Provider>
	);
}

export function useGameSession() {
	const ctx = useContext(GameSessionContext);
	if (!ctx) {
		throw new Error('useGameSession must be used within GameSessionProvider');
	}
	return ctx;
}
