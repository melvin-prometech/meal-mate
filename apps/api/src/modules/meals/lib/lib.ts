export function addToTotal(
  currentValue: number | null,
  newValue: number | null
): number | null {
  if (currentValue === null || newValue === null) {
    return null;
  }
  return currentValue + newValue;
}