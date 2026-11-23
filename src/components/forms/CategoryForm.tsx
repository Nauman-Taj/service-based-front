"use client";

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
import { useState, type FormEvent } from "react";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Textarea from "@/components/common/Textarea";
import { cn } from "@/lib/utils";

/** Icons available to locally created or edited categories. */
export const CATEGORY_ICON_CHOICES = [
  { value: "Sparkles", label: "Sparkles", icon: Sparkles },
  { value: "Wrench", label: "Wrench", icon: Wrench },
  { value: "Zap", label: "Lightning", icon: Zap },
  { value: "Paintbrush", label: "Paintbrush", icon: Paintbrush },
  { value: "Leaf", label: "Leaf", icon: Leaf },
  { value: "Hammer", label: "Hammer", icon: Hammer },
  { value: "Truck", label: "Truck", icon: Truck },
  { value: "WashingMachine", label: "Appliance", icon: WashingMachine },
] as const;

export type CategoryIconName = (typeof CATEGORY_ICON_CHOICES)[number]["value"];

export const CATEGORY_ICON_MAP = CATEGORY_ICON_CHOICES.reduce(
  (map, choice) => {
    map[choice.value] = choice.icon as LucideIcon;
    return map;
  },
  {} as Record<CategoryIconName, LucideIcon>,
);

export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  icon: CategoryIconName;
}

interface CategoryFormProps {
  initialValues?: CategoryFormValues | null;
  /** Used to reject duplicate slugs. The edited category slug is ignored. */
  existingSlugs?: string[];
  onSubmit: (values: CategoryFormValues) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  className?: string;
}

type FieldErrors = Partial<Record<keyof CategoryFormValues, string>>;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Validated add/edit form for marketplace service categories. */
export default function CategoryForm({
  initialValues,
  existingSlugs = [],
  onSubmit,
  onCancel,
  submitLabel = "Save category",
  className,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>({
    name: initialValues?.name ?? "",
    slug: initialValues?.slug ?? "",
    description: initialValues?.description ?? "",
    icon: initialValues?.icon ?? "Sparkles",
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof CategoryFormValues>(
    field: K,
    value: CategoryFormValues[K],
  ) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    const name = values.name.trim();
    const slug = values.slug.trim().toLowerCase();

    if (name.length < 2) {
      next.name = "Enter a category name.";
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      next.slug = "Use lowercase letters, numbers and hyphens.";
    } else if (
      existingSlugs.some(
        (item) => item.toLowerCase() === slug && item !== initialValues?.slug,
      )
    ) {
      next.slug = "Another category already uses this slug.";
    }
    if (values.description.trim().length < 10) {
      next.description = "Add a short description of at least 10 characters.";
    }

    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        name: values.name.trim(),
        slug: values.slug.trim().toLowerCase(),
        description: values.description.trim(),
        icon: values.icon,
      });
    } finally {
      setSaving(false);
    }
  }

  const PreviewIcon = CATEGORY_ICON_MAP[values.icon] ?? Sparkles;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("space-y-5", className)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Category name"
          value={values.name}
          onChange={(event) => {
            const name = event.target.value;
            setValues((previous) => ({
              ...previous,
              name,
              slug: slugTouched ? previous.slug : slugify(name),
            }));
            setErrors((previous) => ({
              ...previous,
              name: undefined,
              slug: undefined,
            }));
          }}
          placeholder="Home Cleaning"
          error={errors.name}
        />
        <Input
          label="Slug"
          value={values.slug}
          onChange={(event) => {
            setSlugTouched(true);
            update("slug", slugify(event.target.value));
          }}
          placeholder="home-cleaning"
          error={errors.slug}
        />
      </div>

      <Select
        label="Category icon"
        value={values.icon}
        onChange={(event) =>
          update("icon", event.target.value as CategoryIconName)
        }
      >
        {CATEGORY_ICON_CHOICES.map((choice) => (
          <option key={choice.value} value={choice.value}>
            {choice.label}
          </option>
        ))}
      </Select>

      <div className="flex items-center gap-2 rounded-xl border border-line bg-background px-3 py-2.5 text-sm text-muted">
        <PreviewIcon className="h-5 w-5 text-primary" aria-hidden="true" />
        Icon preview
      </div>

      <Textarea
        label="Description"
        rows={3}
        value={values.description}
        onChange={(event) => update("description", event.target.value)}
        placeholder="What kind of services belong in this category?"
        error={errors.description}
      />

      <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-5">
        {onCancel ? (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
