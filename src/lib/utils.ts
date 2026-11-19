/**
 * Joins truthy class names into a single string.
 * Keeps conditional styling readable without extra dependencies.
 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
