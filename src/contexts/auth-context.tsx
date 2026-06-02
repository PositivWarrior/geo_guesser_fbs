'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import {
	onAuthStateChanged,
	signInWithPopup,
	signOut as firebaseSignOut,
	GoogleAuthProvider,
	type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { isFirebaseConfigured } from '@/lib/firebase-config';
import { fetchUserEntitlements } from '@/lib/user-entitlements';

type AuthContextValue = {
	user: User | null;
	isLoggedIn: boolean;
	unlockedAmericas: boolean;
	unlockedAfrica: boolean;
	loading: boolean;
	authReady: boolean;
	signInWithGoogle: () => Promise<void>;
	signOut: () => Promise<void>;
	refreshEntitlements: () => Promise<{
		americas: boolean;
		africa: boolean;
	}>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [unlockedAmericas, setUnlockedAmericas] = useState(false);
	const [unlockedAfrica, setUnlockedAfrica] = useState(false);
	const authReady = isFirebaseConfigured() && auth !== null;

	const refreshEntitlements = useCallback(async () => {
		if (!user?.uid) {
			setUnlockedAmericas(false);
			setUnlockedAfrica(false);
			return { americas: false, africa: false };
		}
		const ent = await fetchUserEntitlements(user.uid);
		setUnlockedAmericas(ent.americas);
		setUnlockedAfrica(ent.africa);
		return ent;
	}, [user?.uid]);

	useEffect(() => {
		void refreshEntitlements();
	}, [refreshEntitlements]);

	useEffect(() => {
		if (!auth) {
			setLoading(false);
			return;
		}
		const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
			setUser(nextUser);
			setLoading(false);
		});
		return unsubscribe;
	}, []);

	const signInWithGoogle = useCallback(async () => {
		if (!auth) {
			throw new Error(
				'Firebase Auth is not configured. Check .env.local and enable Google sign-in in Firebase Console.',
			);
		}
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
		await refreshEntitlements();
	}, [refreshEntitlements]);

	const signOut = useCallback(async () => {
		if (!auth) return;
		await firebaseSignOut(auth);
		setUnlockedAmericas(false);
		setUnlockedAfrica(false);
	}, []);

	const value = useMemo(
		() => ({
			user,
			isLoggedIn: Boolean(user),
			unlockedAmericas,
			unlockedAfrica,
			loading,
			authReady,
			signInWithGoogle,
			signOut,
			refreshEntitlements,
		}),
		[
			user,
			unlockedAmericas,
			unlockedAfrica,
			loading,
			authReady,
			signInWithGoogle,
			signOut,
			refreshEntitlements,
		],
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return ctx;
}

export function getLeaderboardDisplayName(user: User | null): string {
	if (!user) return '';
	const name = user.displayName?.trim();
	if (name) return name.slice(0, 20);
	const email = user.email?.split('@')[0];
	return email ? email.slice(0, 20) : '';
}

export function useEntitlementState() {
	const { isLoggedIn, unlockedAmericas, unlockedAfrica } = useAuth();
	return { isLoggedIn, unlockedAmericas, unlockedAfrica };
}
