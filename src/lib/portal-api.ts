/**
 * Authenticated dashboard API calls.
 *
 * These functions are consumed by the dashboard hooks (`useBookings`,
 * `usePortalData`) and never by pages or presentational components directly.
 * Shapes are mapped to the existing frontend records so the UI stays stable.
 */

import { apiRequest } from "@/lib/api";
import type { Booking, BookingStatus } from "@/types/booking";
import type { ContactMessage, ContactStatus } from "@/types/contact";
import type {
  DashboardReviewRecord,
  FavoriteRecord,
  ProviderServiceRecord,
  ReviewStatus,
} from "@/types/dashboard";
import type { Service } from "@/types/service";
import type { Provider } from "@/types/provider";
import type {
  AccountSettingsRecord,
  AdminEntityStatus,
  AvailabilityRule,
  BlockedDateRecord,
  UserProfileRecord,
} from "@/types/dashboard";
import type { User } from "@/types/user";

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

/* -------------------------------------------------------------------------- */
/* Bookings                                                                    */
/* -------------------------------------------------------------------------- */

export interface BookingRequest {
  serviceId: string;
  customerName: string;
  date: string;
  timeSlot: string;
  address: string;
  notes?: string;
}

export function fetchMyBookings(token: string): Promise<Booking[]> {
  return apiRequest<Booking[]>("/bookings/me", {
    headers: authHeaders(token),
  });
}

export function fetchAllBookings(token: string): Promise<Booking[]> {
  return apiRequest<Booking[]>("/bookings", {
    headers: authHeaders(token),
  });
}

export function fetchBookingById(
  id: string,
  token: string,
): Promise<Booking> {
  return apiRequest<Booking>(`/bookings/${encodeURIComponent(id)}`, {
    headers: authHeaders(token),
  });
}

export function createGuestBooking(input: BookingRequest): Promise<Booking> {
  return apiRequest<Booking>("/bookings", { method: "POST", body: input });
}

export function createCustomerBooking(
  input: BookingRequest,
  token: string,
): Promise<Booking> {
  return apiRequest<Booking>("/bookings/me", {
    method: "POST",
    body: input,
    headers: authHeaders(token),
  });
}

export function updateBookingStatusRequest(
  id: string,
  status: BookingStatus,
  token: string,
): Promise<Booking> {
  return apiRequest<Booking>(
    `/bookings/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: { status },
      headers: authHeaders(token),
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Favorites                                                                   */
/* -------------------------------------------------------------------------- */

export function fetchFavorites(token: string): Promise<FavoriteRecord[]> {
  return apiRequest<FavoriteRecord[]>("/favorites", {
    headers: authHeaders(token),
  });
}

export function addFavorite(
  serviceId: string,
  token: string,
): Promise<FavoriteRecord> {
  return apiRequest<FavoriteRecord>("/favorites", {
    method: "POST",
    body: { serviceId },
    headers: authHeaders(token),
  });
}

export function removeFavorite(
  serviceId: string,
  token: string,
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(
    `/favorites/${encodeURIComponent(serviceId)}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Reviews                                                                     */
/* -------------------------------------------------------------------------- */

interface ApiReview {
  id: string;
  serviceId: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
  userId?: string;
  serviceName?: string;
  bookingId?: string;
  status?: ReviewStatus;
}

function toDashboardReview(review: ApiReview): DashboardReviewRecord {
  return {
    id: review.id,
    userId: review.userId,
    serviceId: review.serviceId,
    serviceName: review.serviceName ?? "Service",
    bookingId: review.bookingId,
    author: review.author,
    location: review.location,
    rating: review.rating,
    title: review.title,
    body: review.body,
    date: review.date,
    verified: review.verified,
    status: review.status ?? "published",
  };
}

export function fetchMyReviews(
  token: string,
): Promise<DashboardReviewRecord[]> {
  return apiRequest<ApiReview[]>("/reviews/mine", {
    headers: authHeaders(token),
  }).then((reviews) => reviews.map(toDashboardReview));
}

export function fetchAdminReviews(
  token: string,
): Promise<DashboardReviewRecord[]> {
  return apiRequest<ApiReview[]>("/reviews/admin", {
    headers: authHeaders(token),
  }).then((reviews) => reviews.map(toDashboardReview));
}

export function fetchAllReviews(
  token?: string,
): Promise<DashboardReviewRecord[]> {
  return apiRequest<ApiReview[]>("/reviews", {
    headers: token ? authHeaders(token) : undefined,
  }).then((reviews) => reviews.map(toDashboardReview));
}

export interface ReviewRequest {
  serviceId: string;
  bookingId?: string;
  rating: number;
  title: string;
  body: string;
}

export function createReview(
  input: ReviewRequest,
  token: string,
): Promise<DashboardReviewRecord> {
  return apiRequest<ApiReview>("/reviews", {
    method: "POST",
    body: input,
    headers: authHeaders(token),
  }).then(toDashboardReview);
}

export function updateReview(
  id: string,
  input: Pick<ReviewRequest, "rating" | "title" | "body">,
  token: string,
): Promise<DashboardReviewRecord> {
  return apiRequest<ApiReview>(`/reviews/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: input,
    headers: authHeaders(token),
  }).then(toDashboardReview);
}

export function deleteReview(
  id: string,
  token: string,
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(
    `/reviews/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    },
  );
}

export function setReviewStatusRequest(
  id: string,
  status: ReviewStatus,
  token: string,
): Promise<DashboardReviewRecord> {
  return apiRequest<ApiReview>(
    `/reviews/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: { status },
      headers: authHeaders(token),
    },
  ).then(toDashboardReview);
}

/* -------------------------------------------------------------------------- */
/* Contact inbox                                                               */
/* -------------------------------------------------------------------------- */

export function fetchAdminContacts(token: string): Promise<ContactMessage[]> {
  return apiRequest<ContactMessage[]>("/admin/contacts", {
    headers: authHeaders(token),
  });
}

export function setContactStatusRequest(
  id: string,
  status: ContactStatus,
  token: string,
): Promise<ContactMessage> {
  return apiRequest<ContactMessage>(
    `/admin/contacts/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: { status },
      headers: authHeaders(token),
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Provider services                                                           */
/* -------------------------------------------------------------------------- */

export interface ApiService extends Service {
  status: "active" | "paused";
  createdAt: string;
}

function toProviderService(service: ApiService): ProviderServiceRecord {
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    categorySlug: service.categorySlug,
    categoryName: service.categoryName,
    price: service.price,
    priceUnit: service.priceUnit,
    image: service.image,
    featured: service.featured,
    tags: service.tags,
    includes: service.includes,
    status: service.status,
    createdAt: service.createdAt,
  };
}

export function fetchProviderServices(
  token: string,
): Promise<ProviderServiceRecord[]> {
  return apiRequest<ApiService[]>("/services/mine", {
    headers: authHeaders(token),
  }).then((services) => services.map(toProviderService));
}

export interface ServiceRequest {
  title: string;
  description: string;
  categorySlug: string;
  price: number;
  priceUnit: ProviderServiceRecord["priceUnit"];
  image: string;
  tags: string[];
  includes: string[];
  featured?: boolean;
  status?: ProviderServiceRecord["status"];
}

export function createProviderService(
  input: ServiceRequest,
  token: string,
): Promise<ProviderServiceRecord> {
  return apiRequest<ApiService>("/services", {
    method: "POST",
    body: input,
    headers: authHeaders(token),
  }).then(toProviderService);
}

export function updateProviderService(
  id: string,
  input: Partial<ServiceRequest>,
  token: string,
): Promise<ProviderServiceRecord> {
  return apiRequest<ApiService>(`/services/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: input,
    headers: authHeaders(token),
  }).then(toProviderService);
}

export function setProviderServiceStatus(
  id: string,
  status: ProviderServiceRecord["status"],
  token: string,
): Promise<ProviderServiceRecord> {
  return apiRequest<ApiService>(
    `/services/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: { status },
      headers: authHeaders(token),
    },
  ).then(toProviderService);
}

export function deleteProviderService(
  id: string,
  token: string,
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(
    `/services/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Profile and account settings                                                */
/* -------------------------------------------------------------------------- */

export function fetchProfile(token: string): Promise<UserProfileRecord> {
  return apiRequest<UserProfileRecord>("/profile/me", {
    headers: authHeaders(token),
  });
}

export function saveProfileRequest(
  input: UserProfileRecord,
  token: string,
): Promise<UserProfileRecord> {
  return apiRequest<UserProfileRecord>("/profile/me", {
    method: "PUT",
    body: input,
    headers: authHeaders(token),
  });
}

export function fetchSettings(token: string): Promise<AccountSettingsRecord> {
  return apiRequest<AccountSettingsRecord>("/settings/me", {
    headers: authHeaders(token),
  });
}

export function saveSettingsRequest(
  input: AccountSettingsRecord,
  token: string,
): Promise<AccountSettingsRecord> {
  return apiRequest<AccountSettingsRecord>("/settings/me", {
    method: "PUT",
    body: input,
    headers: authHeaders(token),
  });
}

/* -------------------------------------------------------------------------- */
/* Provider availability                                                       */
/* -------------------------------------------------------------------------- */

export interface AvailabilityData {
  rules: AvailabilityRule[];
  blockedDates: BlockedDateRecord[];
}

export function fetchAvailability(token: string): Promise<AvailabilityData> {
  return apiRequest<AvailabilityData>("/availability/me", {
    headers: authHeaders(token),
  });
}

export function saveAvailabilityRulesRequest(
  rules: AvailabilityRule[],
  token: string,
): Promise<AvailabilityData> {
  return apiRequest<AvailabilityData>("/availability/me", {
    method: "PUT",
    body: { rules },
    headers: authHeaders(token),
  });
}

export function addBlockedDateRequest(
  date: string,
  reason: string,
  token: string,
): Promise<BlockedDateRecord> {
  return apiRequest<BlockedDateRecord>("/availability/me/blocked-dates", {
    method: "POST",
    body: { date, reason },
    headers: authHeaders(token),
  });
}

export function removeBlockedDateRequest(
  id: string,
  token: string,
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(
    `/availability/me/blocked-dates/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Admin directories                                                           */
/* -------------------------------------------------------------------------- */

export interface AdminOverviewRecord {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  revenue: number;
  customers: number;
  providers: number;
  services: number;
  reviews: number;
}

export function fetchAdminOverview(token: string): Promise<AdminOverviewRecord> {
  return apiRequest<AdminOverviewRecord>("/admin/overview", {
    headers: authHeaders(token),
  });
}

export interface AdminCustomerRecord extends User {
  status: AdminEntityStatus;
  bookingCount: number;
}

export function fetchAdminCustomers(
  search: string,
  token: string,
): Promise<AdminCustomerRecord[]> {
  const query = search.trim();
  const path = query
    ? `/admin/customers?search=${encodeURIComponent(query)}`
    : "/admin/customers";
  return apiRequest<AdminCustomerRecord[]>(path, {
    headers: authHeaders(token),
  });
}

export function setCustomerStatusRequest(
  id: string,
  status: AdminEntityStatus,
  token: string,
): Promise<{ id: string; status: AdminEntityStatus }> {
  return apiRequest<{ id: string; status: AdminEntityStatus }>(
    `/admin/customers/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: { status },
      headers: authHeaders(token),
    },
  );
}

export interface AdminProviderRecord extends Provider {
  status: AdminEntityStatus;
  serviceCount: number;
  email?: string;
}

export function fetchAdminProviders(
  search: string,
  token: string,
): Promise<AdminProviderRecord[]> {
  const query = search.trim();
  const path = query
    ? `/admin/providers?search=${encodeURIComponent(query)}`
    : "/admin/providers";
  return apiRequest<AdminProviderRecord[]>(path, {
    headers: authHeaders(token),
  });
}

export function setProviderStatusRequest(
  id: string,
  status: AdminEntityStatus,
  token: string,
): Promise<{ id: string; status: AdminEntityStatus }> {
  return apiRequest<{ id: string; status: AdminEntityStatus }>(
    `/admin/providers/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: { status },
      headers: authHeaders(token),
    },
  );
}

export function setProviderVerificationRequest(
  id: string,
  verified: boolean,
  token: string,
): Promise<AdminProviderRecord> {
  return apiRequest<AdminProviderRecord>(
    `/providers/${encodeURIComponent(id)}/verify`,
    {
      method: "PATCH",
      body: { verified },
      headers: authHeaders(token),
    },
  );
}

export type CategoryIconKey =
  | "Sparkles"
  | "Wrench"
  | "Zap"
  | "Paintbrush"
  | "Leaf"
  | "Hammer"
  | "Truck"
  | "WashingMachine";

export interface ApiCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: CategoryIconKey;
  serviceCount: number;
  enabled: boolean;
}

export interface CategoryRequest {
  name: string;
  slug: string;
  description: string;
  icon: CategoryIconKey;
  enabled?: boolean;
}

export function fetchAdminCategories(token: string): Promise<ApiCategory[]> {
  return apiRequest<ApiCategory[]>("/categories/admin", {
    headers: authHeaders(token),
  });
}

export function createCategoryRequest(
  input: CategoryRequest,
  token: string,
): Promise<ApiCategory> {
  return apiRequest<ApiCategory>("/categories", {
    method: "POST",
    body: input,
    headers: authHeaders(token),
  });
}

export function updateCategoryRequest(
  id: string,
  input: Partial<CategoryRequest>,
  token: string,
): Promise<ApiCategory> {
  return apiRequest<ApiCategory>(`/categories/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: input,
    headers: authHeaders(token),
  });
}

export function deleteCategoryRequest(
  id: string,
  token: string,
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(
    `/categories/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    },
  );
}

export function fetchAdminServices(token: string): Promise<ApiService[]> {
  return apiRequest<ApiService[]>("/services/admin", {
    headers: authHeaders(token),
  });
}

export function updateAdminServiceRequest(
  id: string,
  input: Partial<ServiceRequest>,
  token: string,
): Promise<ApiService> {
  return apiRequest<ApiService>(`/services/admin/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: input,
    headers: authHeaders(token),
  });
}

export function setAdminServiceStatusRequest(
  id: string,
  status: ApiService["status"],
  token: string,
): Promise<ApiService> {
  return apiRequest<ApiService>(
    `/services/admin/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: { status },
      headers: authHeaders(token),
    },
  );
}

export function deleteAdminServiceRequest(
  id: string,
  token: string,
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(
    `/services/admin/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    },
  );
}
