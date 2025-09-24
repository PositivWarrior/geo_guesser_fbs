export function normalizeString(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritical marks
}
