const KEY = 'geo:playerName:v1';

export function getSavedPlayerName(): string {
	if (typeof window === 'undefined') return '';
	try {
		return localStorage.getItem(KEY)?.trim() ?? '';
	} catch {
		return '';
	}
}

export function savePlayerName(name: string): void {
	if (typeof window === 'undefined') return;
	const trimmed = name.trim().slice(0, 20);
	if (!trimmed) return;
	try {
		localStorage.setItem(KEY, trimmed);
	} catch {
		// ignore quota errors
	}
}
