/**
 * Shared shapes for the public contact enquiry and the admin inbox.
 *
 * These mirror the NestJS contacts DTOs: the public status values are
 * lowercase while the database enum is uppercase.
 */

export type ContactStatus = "new" | "read" | "archived";

export interface ContactMessage {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export type ContactSubmissionInput = Pick<
  ContactMessage,
  "name" | "email" | "phone" | "topic" | "message"
>;
