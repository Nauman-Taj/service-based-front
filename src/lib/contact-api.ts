/**
 * Public contact form HTTP calls.
 *
 * Every request goes through `lib/api.ts`; pages and components never call
 * `fetch` directly. The backend returns the stored message, including its
 * human-friendly reference, which the form shows as confirmation.
 */

import { apiRequest } from "@/lib/api";
import type { ContactMessage, ContactSubmissionInput } from "@/types/contact";

export function submitContactMessage(
  input: ContactSubmissionInput,
): Promise<ContactMessage> {
  return apiRequest<ContactMessage>("/contacts", {
    method: "POST",
    body: input,
  });
}
