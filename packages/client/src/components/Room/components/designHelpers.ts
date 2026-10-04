/** Cards are ids like "animal-07" — this pulls the 0-based position back out for array lookups. */
export function indexFromCardId(cardId: string): number {
  const match = /(\d+)$/.exec(cardId);
  return match ? Number(match[1]) - 1 : 0;
}
