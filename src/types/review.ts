export interface Review {
  id: string;
  serviceId: string;
  author: string;
  location: string;
  rating: number;
  /** ISO date string, e.g. "2026-09-28". */
  date: string;
  title: string;
  body: string;
  verified: boolean;
}
