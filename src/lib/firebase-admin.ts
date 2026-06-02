import admin from 'firebase-admin';
import type { PaidRegion } from './bmc';

const ENTITLEMENTS_COLLECTION = 'user_entitlements';

function getServiceAccountFromEnv(): admin.ServiceAccount | null {
	const projectId =
		process.env.FIREBASE_PROJECT_ID?.trim() ||
		process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
	const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

	if (projectId && clientEmail && privateKey) {
		return { projectId, clientEmail, privateKey };
	}

	const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
	if (!raw) {
		return null;
	}
	try {
		return JSON.parse(raw) as admin.ServiceAccount;
	} catch (e) {
		console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON', e);
		return null;
	}
}

function initAdmin(): admin.app.App | null {
	if (admin.apps.length > 0) {
		return admin.app();
	}

	const serviceAccount = getServiceAccountFromEnv();
	if (!serviceAccount) {
		return null;
	}

	return admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

export function isFirebaseAdminConfigured(): boolean {
	return getServiceAccountFromEnv() !== null;
}

export type UserEntitlements = {
	americas?: boolean;
	africa?: boolean;
	email?: string;
	updatedAt?: number;
};

export async function grantPaidRegion(
	uid: string,
	region: PaidRegion,
	email?: string,
): Promise<boolean> {
	const app = initAdmin();
	if (!app) {
		console.error(
			'Firebase Admin not configured — set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (or FIREBASE_SERVICE_ACCOUNT_JSON)',
		);
		return false;
	}
	const db = admin.firestore();
	await db
		.collection(ENTITLEMENTS_COLLECTION)
		.doc(uid)
		.set(
			{
				[region]: true,
				...(email ? { email: email.toLowerCase() } : {}),
				updatedAt: Date.now(),
			},
			{ merge: true },
		);
	return true;
}

export async function getEntitlementsByUid(
	uid: string,
): Promise<UserEntitlements | null> {
	const app = initAdmin();
	if (!app) return null;
	const snap = await admin
		.firestore()
		.collection(ENTITLEMENTS_COLLECTION)
		.doc(uid)
		.get();
	if (!snap.exists) return null;
	return snap.data() as UserEntitlements;
}
