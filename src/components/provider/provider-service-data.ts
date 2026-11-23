"use client";

/**
 * Dashboard-facing alias for the shared provider-services hook.
 *
 * The shared hook now merges static services with saved edits without
 * duplicates and records dashboard deletions, so this alias exists only to
 * keep provider component imports stable.
 */
export { useProviderServices as useManagedProviderServices } from "@/hooks/usePortalData";
