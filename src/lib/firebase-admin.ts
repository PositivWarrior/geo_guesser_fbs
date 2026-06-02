import admin from 'firebase-admin';
import type { PaidRegion } from './bmc';

const ENTITLEMENTS_COLLECTION = 'user_entitlements';

function initAdmin(): admin.app.App | null {
	if (admin.apps.length > 0) {
		return admin.app();
	}
	const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
	if (!raw) {
		return null;
	}
	try {
		const serviceAccount = JSON.parse(raw) as admin.ServiceAccount;
		return admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
		});
	} catch (e) {
		console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON', e);
		return null;
	}
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
			'Firebase Admin not configured — set FIREBASE_SERVICE_ACCOUNT_JSON',
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
