import {
  BarChart3,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  FolderTree,
  Heart,
  LayoutDashboard,
  Settings,
  Star,
  User,
  UserCog,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/types/user";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Sidebar navigation per role. Routes already exist in the app tree. */
export const dashboardNav: Record<UserRole, DashboardNavItem[]> = {
  customer: [
    { label: "Overview", href: "/customer", icon: LayoutDashboard },
    { label: "My Bookings", href: "/customer/bookings", icon: CalendarCheck },
    { label: "Favorites", href: "/customer/favorites", icon: Heart },
    { label: "My Reviews", href: "/customer/reviews", icon: Star },
    { label: "Profile", href: "/customer/profile", icon: User },
    { label: "Settings", href: "/customer/settings", icon: Settings },
  ],
  provider: [
    { label: "Overview", href: "/provider", icon: LayoutDashboard },
    { label: "Bookings", href: "/provider/bookings", icon: CalendarCheck },
    { label: "My Services", href: "/provider/services", icon: Briefcase },
    { label: "Availability", href: "/provider/availability", icon: CalendarDays },
    { label: "Earnings", href: "/provider/earnings", icon: Wallet },
    { label: "Reviews", href: "/provider/reviews", icon: Star },
    { label: "Profile", href: "/provider/profile", icon: User },
    { label: "Settings", href: "/provider/settings", icon: Settings },
  ],
  admin: [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Providers", href: "/admin/providers", icon: UserCog },
    { label: "Services", href: "/admin/services", icon: Wrench },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Profile", href: "/admin/profile", icon: User },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
};
