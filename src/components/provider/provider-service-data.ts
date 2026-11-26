"use client";

/**
 * Dashboard-facing alias for the shared provider-services hook.
 *
 * The hook reads and writes provider services through the NestJS API; this
 * alias exists only to keep provider component imports stable.
 */
export { useProviderServices as useManagedProviderServices } from "@/hooks/usePortalData";
