"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ImageIcon,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";

import Button from "@/components/common/Button";
import { ButtonLink } from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Textarea from "@/components/common/Textarea";
import { useManagedProviderServices } from "@/components/provider/provider-service-data";
import { categories } from "@/data/categories";
import { services as mockServices } from "@/data/services";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { makeId } from "@/lib/portal-store";
import type { PriceUnit } from "@/types/service";
import type { ProviderServiceRecord } from "@/types/dashboard";
import { formatDate } from "@/utils/formatDate";
import { priceUnitLabels } from "@/utils/priceUnit";

const PRICE_UNITS: PriceUnit[] = ["hour", "fixed", "room", "project"];

interface ServiceValues {
  title: string;
  description: string;
  categorySlug: string;
  price: string;
  priceUnit: PriceUnit;
  image: string;
  tagsText: string;
  includesText: string;
  featured: boolean;
  status: ProviderServiceRecord["status"];
}

type ServiceErrors = Partial<Record<keyof ServiceValues, string>>;

interface ServiceFieldsProps {
  service?: ProviderServiceRecord;
  saveService: (service: ProviderServiceRecord) => void;
  deleteService: (id: string) => void;
  onDone: () => void;
}

function isImageSource(value: string): boolean {
  return value.startsWith("/") || /^https?:\/\//i.test(value);
}

function valuesFromService(
  service: ProviderServiceRecord | undefined,
  fallbackImage: string,
): ServiceValues {
  return {
    title: service?.title ?? "",
    description: service?.description ?? "",
    categorySlug: service?.categorySlug ?? "",
    price: service ? String(service.price) : "",
    priceUnit: service?.priceUnit ?? "fixed",
    image: service?.image ?? fallbackImage,
    tagsText: service?.tags.join(", ") ?? "",
    includesText: service?.includes.join("\n") ?? "",
    featured: service?.featured ?? false,
    status: service?.status ?? "active",
  };
}

function validate(values: ServiceValues): ServiceErrors {
  const errors: ServiceErrors = {};

  if (values.title.trim().length < 5) {
    errors.title = "Use at least 5 characters for the service title.";
  }
  if (values.description.trim().length < 20) {
    errors.description = "Describe the service in at least 20 characters.";
  }
  if (!categories.some((category) => category.slug === values.categorySlug)) {
    errors.categorySlug = "Choose a category for this service.";
  }

  const price = Number(values.price);
  if (!values.price.trim() || !Number.isFinite(price) || price <= 0) {
    errors.price = "Enter a price greater than zero.";
  }
  if (!isImageSource(values.image.trim())) {
    errors.image = "Choose a preset image or enter a valid image URL.";
  }
  if (values.tagsText.split(",").filter((tag) => tag.trim()).length > 8) {
    errors.tagsText = "Use up to 8 short tags.";
  }
  const includes = values.includesText
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  if (includes.length === 0) {
    errors.includesText = "Add at least one item to the includes list.";
  }
  if (includes.length > 10) {
    errors.includesText = "Keep the includes list to 10 items or fewer.";
  }

  return errors;
}

function ServiceFields({
  service,
  saveService,
  deleteService,
  onDone,
}: ServiceFieldsProps) {
  const presetImages = useMemo(
    () => Array.from(new Set(mockServices.map((item) => item.image))).slice(0, 8),
    [],
  );
  const [values, setValues] = useState<ServiceValues>(() =>
    valuesFromService(service, presetImages[0] ?? ""),
  );
  const [errors, setErrors] = useState<ServiceErrors>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  function update<K extends keyof ServiceValues>(
    field: K,
    value: ServiceValues[K],
  ) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const category = categories.find(
      (item) => item.slug === values.categorySlug,
    );
    if (!category) {
      return;
    }

    saveService({
      id: service?.id ?? makeId("svc"),
      title: values.title.trim(),
      description: values.description.trim(),
      categorySlug: category.slug,
      categoryName: category.name,
      price: Number(values.price),
      priceUnit: values.priceUnit,
      image: values.image.trim(),
      featured: values.featured,
      tags: values.tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      includes: values.includesText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      status: values.status,
      createdAt: service?.createdAt ?? new Date().toISOString(),
    });
    onDone();
  }

  return (
    <div className="space-y-8">
      <DashboardIntro
        title={service ? "Edit service" : "Add a service"}
        description={
          service
            ? "Update the details customers see on your listing."
            : "Create a new service and choose how it appears in search results."
        }
        action={
          <ButtonLink href="/provider/services" variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to services
          </ButtonLink>
        }
      />

      {service ? (
        <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
          <h3 className="text-sm font-bold text-heading">Service record</h3>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Service ID
              </dt>
              <dd className="mt-1 font-medium text-heading">{service.id}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Category
              </dt>
              <dd className="mt-1 font-medium text-heading">
                {service.categoryName}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Created
              </dt>
              <dd className="mt-1 font-medium text-heading">
                {formatDate(service.createdAt.slice(0, 10))}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-5 rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-7">
          <div>
            <h3 className="text-lg font-bold text-heading">Service details</h3>
            <p className="mt-1 text-sm text-muted">
              Write a clear title and description so customers know what to
              expect.
            </p>
          </div>

          <Input
            label="Service title"
            value={values.title}
            onChange={(event) => update("title", event.target.value)}
            placeholder="Deep Home Cleaning"
            error={errors.title}
          />

          <Textarea
            label="Description"
            rows={5}
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Explain what is covered, who it suits and how you deliver it."
            error={errors.description}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Category"
              value={values.categorySlug}
              onChange={(event) =>
                update("categorySlug", event.target.value)
              }
              error={errors.categorySlug}
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Select>

            <Input
              label="Price (PKR)"
              type="number"
              min="1"
              step="100"
              value={values.price}
              onChange={(event) => update("price", event.target.value)}
              placeholder="16800"
              error={errors.price}
            />
          </div>

          <Select
            label="Price unit"
            value={values.priceUnit}
            onChange={(event) =>
              update("priceUnit", event.target.value as PriceUnit)
            }
          >
            {PRICE_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {priceUnitLabels[unit]}
              </option>
            ))}
          </Select>

          <Select
            label="Status"
            value={values.status}
            onChange={(event) =>
              update("status", event.target.value as ProviderServiceRecord["status"])
            }
          >
            <option value="active">Active — visible to customers</option>
            <option value="paused">Paused — hidden from new bookings</option>
          </Select>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-card p-5 shadow-sm">
            <h3 className="text-sm font-bold text-heading">Service image</h3>
            <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
              {values.image.trim() && isImageSource(values.image.trim()) ? (
                <Image
                  src={values.image.trim()}
                  alt="Service image preview"
                  fill
                  unoptimized
                  sizes="320px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center text-muted">
                  <ImageIcon className="h-8 w-8" aria-hidden="true" />
                </span>
              )}
            </div>
            <div className="mt-4">
              <Input
                label="Image URL"
                value={values.image}
                onChange={(event) => update("image", event.target.value)}
                placeholder="/images/services/deep-home-cleaning.jpg"
                error={errors.image}
              />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
              Or choose a preset
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {presetImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => update("image", image)}
                  aria-label={`Use preset image ${index + 1}`}
                  aria-pressed={values.image === image}
                  className={cn(
                    "relative h-14 w-20 overflow-hidden rounded-lg border-2 transition-colors",
                    values.image === image
                      ? "border-primary"
                      : "border-line hover:border-primary/50",
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-line bg-card p-5 shadow-sm">
            <Textarea
              label="Tags (comma separated)"
              rows={2}
              value={values.tagsText}
              onChange={(event) => update("tagsText", event.target.value)}
              placeholder="Eco-friendly, Same-week availability"
              error={errors.tagsText}
            />
            <Textarea
              label="What is included (one per line)"
              rows={5}
              value={values.includesText}
              onChange={(event) => update("includesText", event.target.value)}
              placeholder={"Diagnosis and upfront quote\nFinal clean and tidy-up"}
              error={errors.includesText}
            />

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-background p-4">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(event) => update("featured", event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-heading">
                  <Sparkles className="h-4 w-4 text-highlight" aria-hidden="true" />
                  Feature this service
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">
                  Highlight it across your listing with a gold badge.
                </span>
              </span>
            </label>
          </section>

          <div className="space-y-3">
            <Button type="submit" className="w-full">
              <Save className="h-4 w-4" aria-hidden="true" />
              {service ? "Save changes" : "Create service"}
            </Button>
            {service ? (
              <Button
                variant="outline"
                className="w-full text-red-600 hover:border-red-300 hover:text-red-700"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete service
              </Button>
            ) : null}
          </div>
        </aside>
      </form>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete service"
        description={
          service
            ? `Remove ${service.title} from your provider portal? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete service"
        destructive
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          if (service) {
            deleteService(service.id);
          }
          onDone();
        }}
      />
    </div>
  );
}

export default function ServiceForm({ serviceId }: { serviceId?: string }) {
  const { user } = useAuth();
  const providerId = user?.providerId;
  const { services, saveService, deleteService } = useManagedProviderServices(
    providerId,
  );
  const router = useRouter();
  const service = serviceId
    ? services.find((item) => item.id === serviceId)
    : undefined;

  if (!providerId) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Provider account required"
        description="Sign in with a provider account to manage services."
        action={
          <ButtonLink href="/login">Sign in</ButtonLink>
        }
      />
    );
  }

  if (serviceId && !service) {
    return (
      <div className="space-y-6">
        <DashboardIntro
          title="Service not found"
          description="This service may have been removed or the link is incorrect."
        />
        <EmptyState
          icon={AlertCircle}
          title="We could not find that service"
          description="Return to your service list to choose another item or add a new one."
          action={
            <ButtonLink href="/provider/services">
              Back to my services
            </ButtonLink>
          }
        />
      </div>
    );
  }

  return (
    <ServiceFields
      key={service?.id ?? "new-service"}
      service={service}
      saveService={saveService}
      deleteService={deleteService}
      onDone={() => router.push("/provider/services")}
    />
  );
}
