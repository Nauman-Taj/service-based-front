import {
  Hammer,
  Leaf,
  Paintbrush,
  Sparkles,
  Truck,
  WashingMachine,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the backend's stable icon keys to Lucide components.
 * Keep the keys in sync with `CATEGORY_ICONS` in the backend.
 */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Wrench,
  Zap,
  Paintbrush,
  Leaf,
  Hammer,
  Truck,
  WashingMachine,
};

export function resolveCategoryIcon(name?: string): LucideIcon {
  return (name && CATEGORY_ICONS[name]) || Sparkles;
}
