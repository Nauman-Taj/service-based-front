export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled";

/**
 * A service booking. Mirrors the shape a NestJS bookings module will return;
 * today the data is mocked in `data/bookings.ts`.
 */
export interface Booking {
  id: string;
  reference: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  /** Service date, ISO `yyyy-mm-dd`. */
  date: string;
  timeSlot: string;
  address: string;
  status: BookingStatus;
  /** Agreed total in PKR. */
  price: number;
  createdAt: string;
  notes?: string;
}
