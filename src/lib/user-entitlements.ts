'use server';

import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { isFirebaseConfigured } from './firebase-config';

export type ClientEntitlements = {
	americas: boolean;
	africa: boolean;
};

const COLLECTION = 'user_entitlements';

export async function fetchUserEntitlements(
	uid: string,
): Promise<ClientEntitlements> {
	const empty = { americas: false, africa: false };
	if (!isFirebaseConfigured() || !db || !uid) {
		return empty;
	}
	try {
		const snap = await getDoc(doc(db, COLLECTION, uid));
		if (!snap.exists()) return empty;
		const data = snap.data();
		return {
			americas: Boolean(data.americas),
			africa: Boolean(data.africa),
		};
	} catch (e) {
		console.error('fetchUserEntitlements', e);
		return empty;
	}
}
