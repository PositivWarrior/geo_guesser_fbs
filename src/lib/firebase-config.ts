const REQUIRED_KEYS = [
	'NEXT_PUBLIC_FIREBASE_API_KEY',
	'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
	'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
	'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
	'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
	'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const;

export function isFirebaseConfigured(): boolean {
	return REQUIRED_KEYS.every((key) => Boolean(process.env[key]?.trim()));
}

export function getFirebaseConfigStatus(): {
	configured: boolean;
	missing: string[];
} {
	const missing = REQUIRED_KEYS.filter((key) => !process.env[key]?.trim());
	return {
		configured: missing.length === 0,
		missing: [...missing],
	};
}
