export type StoredScore = {
  id: string;
  date: string; // ISO
  continentId: string;
  continentName: string;
  score: number;
  total: number;
  timeTaken: number; // seconds
};

const KEY = 'geo:scores:v1';

export function getScores(): StoredScore[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredScore[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScore(entry: Omit<StoredScore, 'id' | 'date'>) {
  if (typeof window === 'undefined') return;
  const list = getScores();
  const record: StoredScore = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    ...entry,
  };
  localStorage.setItem(KEY, JSON.stringify([record, ...list].slice(0, 200)));
}

export function clearScores() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}

