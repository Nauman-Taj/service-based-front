export function formatDate(isoDate: string): string {
  // Parse as local midnight so date-only strings do not shift a day in
  // negative UTC offsets.
  const date = new Date(`${isoDate}T00:00:00`);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
