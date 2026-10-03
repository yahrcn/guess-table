/**
 * Normalizes a yes/no question for duplicate detection: trims, lowercases,
 * collapses whitespace, and strips trailing punctuation so that
 * "Это мужчина?" and "это мужчина  ?" are treated as the same question.
 */
export function normalizeQuestion(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:…'"\-]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
