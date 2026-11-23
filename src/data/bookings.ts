import type { Booking } from "@/types/booking";

/**
 * Mock bookings for the dashboards. The demo customer (`user-cust-1`, Hira
 * Malik) and demo provider (`prov-1`, Ayesha Home Cleaning) match the
 * hardcoded accounts in `lib/mock-auth.ts`, so each role sees real data
 * after signing in.
 */
export const bookings: Booking[] = [
  {
    id: "bk-1",
    reference: "QK-8F2K1A",
    serviceId: "svc-1",
    serviceName: "Deep Home Cleaning",
    serviceImage: "/images/services/deep-home-cleaning.jpg",
    customerId: "user-cust-1",
    customerName: "Hira Malik",
    providerId: "prov-1",
    providerName: "Ayesha Home Cleaning",
    date: "2026-11-26",
    timeSlot: "10:00 AM – 1:00 PM",
    address: "House 42, Street 7, Gulgasht Colony, Multan",
    status: "confirmed",
    price: 16800,
    createdAt: "2026-11-20T10:30:00.000Z",
    notes: "Please bring eco-friendly products; we have a cat.",
  },
  {
    id: "bk-2",
    reference: "QK-3M9Q7B",
    serviceId: "svc-5",
    serviceName: "Lawn Mowing & Garden Care",
    serviceImage: "/images/services/lawn-mowing-garden-care.jpg",
    customerId: "user-cust-1",
    customerName: "Hira Malik",
    providerId: "prov-5",
    providerName: "Fatima Garden Care",
    date: "2026-11-12",
    timeSlot: "8:00 AM – 10:00 AM",
    address: "House 42, Street 7, Gulgasht Colony, Multan",
    status: "completed",
    price: 8400,
    createdAt: "2026-11-08T14:10:00.000Z",
  },
  {
    id: "bk-3",
    reference: "QK-6T4R2C",
    serviceId: "svc-2",
    serviceName: "Emergency Plumbing Repair",
    serviceImage: "/images/services/emergency-plumbing-repair.jpg",
    customerId: "user-cust-1",
    customerName: "Hira Malik",
    providerId: "prov-2",
    providerName: "Bilal Plumbing Services",
    date: "2026-11-28",
    timeSlot: "2:00 PM – 4:00 PM",
    address: "House 42, Street 7, Gulgasht Colony, Multan",
    status: "pending",
    price: 11900,
    createdAt: "2026-11-22T09:05:00.000Z",
    notes: "Kitchen tap keeps dripping even when fully closed.",
  },
  {
    id: "bk-4",
    reference: "QK-1H8W5D",
    serviceId: "svc-4",
    serviceName: "Interior Wall Painting",
    serviceImage: "/images/services/interior-wall-painting.jpg",
    customerId: "user-cust-1",
    customerName: "Hira Malik",
    providerId: "prov-6",
    providerName: "Zain Painting Services",
    date: "2026-11-05",
    timeSlot: "9:00 AM – 5:00 PM",
    address: "House 42, Street 7, Gulgasht Colony, Multan",
    status: "cancelled",
    price: 44800,
    createdAt: "2026-10-28T11:45:00.000Z",
    notes: "Postponed to next month — cancelled by customer.",
  },
  {
    id: "bk-5",
    reference: "QK-9J3L6E",
    serviceId: "svc-1",
    serviceName: "Deep Home Cleaning",
    serviceImage: "/images/services/deep-home-cleaning.jpg",
    customerId: "user-cust-2",
    customerName: "Ahmad Raza",
    providerId: "prov-1",
    providerName: "Ayesha Home Cleaning",
    date: "2026-11-27",
    timeSlot: "9:00 AM – 12:00 PM",
    address: "Flat 3B, Cantt View Apartments, Multan Cantt",
    status: "pending",
    price: 16800,
    createdAt: "2026-11-21T16:20:00.000Z",
    notes: "Move-out clean; apartment is unfurnished.",
  },
  {
    id: "bk-6",
    reference: "QK-5B7N4F",
    serviceId: "svc-1",
    serviceName: "Deep Home Cleaning",
    serviceImage: "/images/services/deep-home-cleaning.jpg",
    customerId: "user-cust-3",
    customerName: "Ayesha Rahman",
    providerId: "prov-1",
    providerName: "Ayesha Home Cleaning",
    date: "2026-11-18",
    timeSlot: "11:00 AM – 2:00 PM",
    address: "House 18, Block D, Bosan Road, Multan",
    status: "completed",
    price: 16800,
    createdAt: "2026-11-14T08:50:00.000Z",
  },
  {
    id: "bk-7",
    reference: "QK-2D6P9G",
    serviceId: "svc-3",
    serviceName: "Home Electrical Inspection",
    serviceImage: "/images/services/home-electrical-inspection.jpg",
    customerId: "user-cust-4",
    customerName: "Hassan Shah",
    providerId: "prov-3",
    providerName: "Usman Electric Works",
    date: "2026-11-23",
    timeSlot: "10:00 AM – 12:00 PM",
    address: "House 7, Shah Rukn-e-Alam Colony, Multan",
    status: "in-progress",
    price: 13300,
    createdAt: "2026-11-19T13:15:00.000Z",
  },
  {
    id: "bk-8",
    reference: "QK-7C1V8H",
    serviceId: "svc-6",
    serviceName: "Custom Shelving Installation",
    serviceImage: "/images/services/custom-shelving-installation.jpg",
    customerId: "user-cust-5",
    customerName: "Sana Javed",
    providerId: "prov-4",
    providerName: "Hamza Carpentry Works",
    date: "2026-11-25",
    timeSlot: "3:00 PM – 6:00 PM",
    address: "House 55, DHA Phase 2, Multan",
    status: "confirmed",
    price: 31500,
    createdAt: "2026-11-20T17:40:00.000Z",
    notes: "Three floating shelves for the study wall.",
  },
];

export function getBookingsByCustomerId(customerId: string): Booking[] {
  return bookings
    .filter((booking) => booking.customerId === customerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBookingsByProviderId(providerId: string): Booking[] {
  return bookings
    .filter((booking) => booking.providerId === providerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getRecentBookings(limit: number): Booking[] {
  return [...bookings]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
