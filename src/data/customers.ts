import type { User } from "@/types/user";

/**
 * Mock customer accounts for the admin area. The demo sign-in customer
 * (Hira Malik, `user-cust-1`) matches the hardcoded account in
 * `lib/mock-auth.ts`.
 */
export const customers: User[] = [
  {
    id: "user-cust-1",
    name: "Hira Malik",
    email: "hira@quicker.com",
    role: "customer",
    phone: "0300 1234567",
    createdAt: "2026-08-14T09:00:00.000Z",
  },
  {
    id: "user-cust-2",
    name: "Ahmad Raza",
    email: "ahmad.raza@example.com",
    role: "customer",
    phone: "0301 1112223",
    createdAt: "2026-07-22T09:00:00.000Z",
  },
  {
    id: "user-cust-3",
    name: "Ayesha Rahman",
    email: "ayesha.rahman@example.com",
    role: "customer",
    phone: "0302 2223334",
    createdAt: "2026-09-03T09:00:00.000Z",
  },
  {
    id: "user-cust-4",
    name: "Hassan Shah",
    email: "hassan.shah@example.com",
    role: "customer",
    phone: "0303 3334445",
    createdAt: "2026-06-18T09:00:00.000Z",
  },
  {
    id: "user-cust-5",
    name: "Sana Javed",
    email: "sana.javed@example.com",
    role: "customer",
    phone: "0304 4445556",
    createdAt: "2026-10-01T09:00:00.000Z",
  },
];
