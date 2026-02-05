/**
 * Truncates a string to a specified length and adds an ellipsis if it exceeds the length.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
