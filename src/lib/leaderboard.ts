'use server';

import {
	collection,
	addDoc,
	query,
	where,
	orderBy,
	limit,
	getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { isFirebaseConfigured } from './firebase-config';

export type LeaderboardEntry = {
	id?: string;
	playerName: string;
	continentId: string;
	continentName: string;
	score: number;
	total: number;
	timeTaken: number; // seconds
	timestamp: number; // Unix timestamp in milliseconds
};

const COLLECTION_NAME = 'leaderboard';

const NOT_CONFIGURED =
	'Leaderboard is not configured. Add Firebase env vars (see docs/SETUP.md).';

/**
 * Save a score to the global leaderboard
 */
export async function saveToLeaderboard(
	entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>,
): Promise<{ success: boolean; error?: string }> {
	if (!isFirebaseConfigured() || !db) {
		return { success: false, error: NOT_CONFIGURED };
	}

	try {
		const docData = {
			...entry,
			timestamp: Date.now(),
		};

		await addDoc(collection(db, COLLECTION_NAME), docData);
		return { success: true };
	} catch (error) {
		console.error('Error saving to leaderboard:', error);
		return {
			success: false,
			error: 'Failed to save score to leaderboard',
		};
	}
}

/**
 * Get top scores for a specific continent
 */
export async function getLeaderboardByContinent(
	continentId: string,
	limitCount: number = 10,
): Promise<LeaderboardEntry[]> {
	if (!isFirebaseConfigured() || !db) {
		return [];
	}

	try {
		const q = query(
			collection(db, COLLECTION_NAME),
			where('continentId', '==', continentId),
			orderBy('score', 'desc'),
			orderBy('timeTaken', 'asc'),
			limit(limitCount),
		);

		const querySnapshot = await getDocs(q);
		const entries: LeaderboardEntry[] = [];

		querySnapshot.forEach((doc) => {
			entries.push({
				id: doc.id,
				...(doc.data() as Omit<LeaderboardEntry, 'id'>),
			});
		});

		return entries;
	} catch (error) {
		console.error('Error fetching leaderboard:', error);
		return [];
	}
}

/**
 * Get all leaderboards grouped by continent
 */
export async function getAllLeaderboards(
	limitPerContinent: number = 10,
): Promise<{
	leaderboards: Record<string, LeaderboardEntry[]>;
	configured: boolean;
}> {
	if (!isFirebaseConfigured() || !db) {
		return { leaderboards: {}, configured: false };
	}

	try {
		const continents = [
			'europe',
			'asia-oceania',
			'americas',
			'africa',
			'all-world',
		];

		const leaderboards: Record<string, LeaderboardEntry[]> = {};

		await Promise.all(
			continents.map(async (continentId) => {
				leaderboards[continentId] = await getLeaderboardByContinent(
					continentId,
					limitPerContinent,
				);
			}),
		);

		return { leaderboards, configured: true };
	} catch (error) {
		console.error('Error fetching all leaderboards:', error);
		return { leaderboards: {}, configured: true };
	}
}

export async function isLeaderboardAvailable(): Promise<boolean> {
	return isFirebaseConfigured();
}
