/**
 * Verifies .env.local has all Firebase variables set (does not call Firestore).
 */
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const KEYS = [
	'NEXT_PUBLIC_FIREBASE_API_KEY',
	'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
	'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
	'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
	'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
	'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missing = KEYS.filter((k) => !process.env[k]?.trim());
const set = KEYS.filter((k) => process.env[k]?.trim());

console.log('Firebase env check (.env.local)\n');
for (const k of set) {
	const v = process.env[k];
	const preview =
		k === 'NEXT_PUBLIC_FIREBASE_API_KEY'
			? `${v.slice(0, 6)}…${v.slice(-4)} (${v.length} chars)`
			: v;
	console.log(`  ✓ ${k}=${preview}`);
}
for (const k of missing) {
	console.log(`  ✗ ${k} (missing or empty)`);
}

if (missing.length > 0) {
	console.log(
		'\nIncomplete: add missing values in .env.local, then restart npm run dev.',
	);
	if (missing.includes('NEXT_PUBLIC_FIREBASE_API_KEY')) {
		console.log(
			'  API key: Firebase Console → Project settings → Your apps → GeoGuesser',
		);
		console.log(
			'  → scroll to "SDK setup and configuration" → copy apiKey from the config snippet.',
		);
	}
	process.exit(1);
}

console.log('\nAll Firebase client environment variables are set.');

const adminEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
const adminKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
const adminJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();

console.log('\nFirebase Admin (webhooks):');
if (adminEmail && adminKey) {
	console.log(`  ✓ FIREBASE_CLIENT_EMAIL=${adminEmail}`);
	console.log(
		`  ✓ FIREBASE_PRIVATE_KEY=…${adminKey.slice(-20)} (${adminKey.length} chars)`,
	);
} else if (adminJson) {
	console.log(`  ✓ FIREBASE_SERVICE_ACCOUNT_JSON (${adminJson.length} chars)`);
} else {
	console.log('  ✗ FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY (or FIREBASE_SERVICE_ACCOUNT_JSON)');
	console.log('    Required for Buy Me a Coffee webhook unlocks on the server.');
	process.exit(1);
}

process.exit(0);
