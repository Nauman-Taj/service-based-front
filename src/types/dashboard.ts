/**
 * Shared types for the frontend-only dashboard modules.
 *
 * These shapes are intentionally simple localStorage-backed records. They can
 * later be replaced by NestJS DTOs without changing the dashboard components.
 */

export interface UserProfileRecord {
  fullName: string;
  phone: string;
  location: string;
  bio?: string;
  businessName?: string;
  specialty?: string;
  website?: string;
  avatar?: string;
}

export const emptyUserProfile: UserProfileRecord = {
  fullName: "",
  phone: "",
  location: "",
  bio: "",
  businessName: "",
  specialty: "",
  website: "",
  avatar: "",
};

export interface AccountSettingsRecord {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  showPublicProfile: boolean;
  language: "en" | "ur";
  timezone: "Asia/Karachi" | "UTC";
}

export const defaultAccountSettings: AccountSettingsRecord = {
  emailNotifications: true,
  smsNotifications: false,
  marketingEmails: false,
  showPublicProfile: true,
  language: "en",
  timezone: "Asia/Karachi",
};

export interface FavoriteRecord {
  id: string;
  serviceId: string;
  createdAt: string;
}

export type ReviewStatus = "published" | "pending" | "rejected";

export interface DashboardReviewRecord {
  id: string;
  /** Present for reviews created inside the dashboards (when signed in). */
  userId?: string;
  serviceId: string;
  serviceName: string;
  bookingId?: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  status: ReviewStatus;
}

export interface AvailabilityRule {
  /** 0 = Sunday … 6 = Saturday. */
  day: number;
  enabled: boolean;
  slots: string[];
}

export interface BlockedDateRecord {
  id: string;
  date: string;
  reason: string;
}

export interface ProviderServiceRecord {
  id: string;
  title: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  priceUnit: "hour" | "fixed" | "room" | "project";
  image: string;
  featured: boolean;
  tags: string[];
  includes: string[];
  status: "active" | "paused";
  createdAt: string;
}

export type AdminEntityStatus = "active" | "pending" | "suspended";
