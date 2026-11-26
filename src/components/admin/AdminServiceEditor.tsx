"use client";

import { ArrowLeft, CheckCircle2, Pause, Play, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, type FormEvent } from "react";

import { useAdminCategories } from "@/components/admin/admin-category-store";
import {
  useAdminServiceOverrides,
  type AdminServiceRecord,
  type ServiceOverride,
} from "@/components/admin/admin-service-overrides";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Badge from "@/components/common/Badge";
import Button, { ButtonLink } from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import Input from "@/components/common/Input";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Select from "@/components/common/Select";
import Textarea from "@/components/common/Textarea";
import type { Category } from "@/types/category";
import type { AdminEntityStatus } from "@/types/dashboard";
import { formatCurrency } from "@/utils/formatCurrency";

function describeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "We could not update this service. Please try again.";
}

export default function AdminServiceEditor() {
  const params = useParams<{ serviceId: string }>();
  const serviceId =
    typeof params.serviceId === "string" ? params.serviceId : "";

  return <ServiceEditorInner key={serviceId} serviceId={serviceId} />;
}

function ServiceEditorInner({ serviceId }: { serviceId: string }) {
  const {
    getServiceById,
    saveService,
    deleteService,
    setServiceStatus,
    statuses,
    loading: servicesLoading,
    error: servicesError,
  } = useAdminServiceOverrides();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAdminCategories();
  const service = getServiceById(serviceId);

  if (servicesLoading || categoriesLoading) {
    return <LoadingSpinner label="Loading service…" />;
  }

  if (!service) {
    return (
      <div className="space-y-6">
        <ButtonLink href="/admin/services" variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to services
        </ButtonLink>
        <EmptyState
          icon={Trash2}
          title="Service not found"
          description={
            servicesError ??
            "This service is not in the marketplace catalogue. It may have been removed by an administrator."
          }
          action={
            <ButtonLink href="/admin/services" size="sm">
              View all services
            </ButtonLink>
          }
        />
      </div>
    );
  }

  const currentStatus: AdminEntityStatus =
    statuses[serviceId] ??
    (service.status === "active" ? "active" : "suspended");

  return (
    <ServiceEditorForm
      service={service}
      categories={categories}
      currentStatus={currentStatus}
      loadError={servicesError ?? categoriesError}
      saveService={saveService}
      deleteService={deleteService}
      setServiceStatus={setServiceStatus}
    />
  );
}

interface ServiceEditorFormProps {
  service: AdminServiceRecord;
  categories: Category[];
  currentStatus: AdminEntityStatus;
  loadError: string | null;
  saveService: (id: string, next: ServiceOverride) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  setServiceStatus: (id: string, status: AdminEntityStatus) => Promise<void>;
}

function ServiceEditorForm({
  service,
  categories,
  currentStatus,
  loadError,
  saveService,
  deleteService,
  setServiceStatus,
}: ServiceEditorFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ServiceOverride>({
    title: service.title,
    description: service.description,
    price: service.price,
    categorySlug: service.categorySlug,
    categoryName: service.categoryName,
    featured: service.featured,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmation, setConfirmation] = useState<"delete" | "pause" | null>(
    null,
  );

  function update<K extends keyof ServiceOverride>(
    field: K,
    value: ServiceOverride[K],
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
    setMessage("");
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (form.title.trim().length < 5) {
      next.title = "Enter a service title of at least 5 characters.";
    }
    if (form.description.trim().length < 20) {
      next.description = "Describe the service in at least 20 characters.";
    }
    if (!Number.isFinite(form.price) || form.price <= 0) {
      next.price = "Enter a price greater than zero.";
    }
    if (!form.categorySlug) {
      next.categorySlug = "Choose a service category.";
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

    const selectedCategory = categories.find(
      (category) => category.slug === form.categorySlug,
    );
    setSaving(true);
    setActionError(null);
    setMessage("");
    try {
      await saveService(service.id, {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        price: Math.round(form.price),
        categoryName: selectedCategory?.name ?? form.categoryName,
      });
      setMessage("Service changes saved to the marketplace catalogue.");
    } catch (requestError) {
      setActionError(describeError(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmation() {
    if (confirmation === "delete") {
      setActionError(null);
      try {
        await deleteService(service.id);
        router.push("/admin/services");
      } catch (requestError) {
        setActionError(describeError(requestError));
      }
      return;
    }

    if (confirmation === "pause") {
      const next: AdminEntityStatus =
        currentStatus === "suspended" ? "active" : "suspended";
      setActionError(null);
      try {
        await setServiceStatus(service.id, next);
        setMessage(
          next === "suspended"
            ? "Service paused. It is no longer active in the marketplace catalogue."
            : "Service activated.",
        );
      } catch (requestError) {
        setActionError(describeError(requestError));
      }
    }
  }

  return (
    <div className="space-y-6">
      <ButtonLink href="/admin/services" variant="ghost" size="sm">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to services
      </ButtonLink>

      <DashboardIntro
        title="Edit service"
        description={`Update listing details for ${service.title}.`}
        action={
          <AdminStatusBadge
            status={currentStatus}
            label={currentStatus === "suspended" ? "Paused" : undefined}
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-heading">Listing details</h2>
          <p className="mt-1 text-sm text-muted">
            Saved changes are written to the API and appear across the marketplace.
          </p>

          {loadError || actionError ? (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {actionError ?? loadError}
            </p>
          ) : null}

          {message ? (
            <p
              role="status"
              className="mt-5 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {message}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <Input
              label="Service title"
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              error={errors.title}
            />
            <Textarea
              label="Description"
              rows={5}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              error={errors.description}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Price (PKR)"
                type="number"
                min={1}
                step={1}
                value={form.price}
                onChange={(event) =>
                  update("price", Number(event.target.value))
                }
                error={errors.price}
              />
              <Select
                label="Category"
                value={form.categorySlug}
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
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-background px-4 py-3.5">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => update("featured", event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#0D9488]"
              />
              <span>
                <span className="block text-sm font-semibold text-heading">
                  Featured service
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  Highlight this listing in marketplace collections.
                </span>
              </span>
            </label>

            <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmation("pause")}
              >
                {currentStatus === "suspended" ? (
                  <Play className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Pause className="h-4 w-4" aria-hidden="true" />
                )}
                {currentStatus === "suspended" ? "Activate" : "Pause"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setConfirmation("delete")}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </section>

        <aside className="h-fit space-y-4">
          <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
            <div className="relative h-44 bg-background">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 1024px) 100vw, 20rem"
                className="object-cover"
              />
            </div>
            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Provider
                </p>
                <p className="mt-1 text-sm font-semibold text-heading">
                  {service.providerName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Current price
                </p>
                <p className="mt-1 text-lg font-bold text-heading">
                  {formatCurrency(service.price)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Rating
                </p>
                <p className="mt-1 text-sm font-semibold text-heading">
                  {service.rating.toFixed(1)} / 5 ({service.reviewCount} reviews)
                </p>
              </div>
              {service.tags.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Tags
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <Badge key={tag} variant="primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {service.includes.length > 0 ? (
            <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                What is included
              </p>
              <ul className="mt-3 space-y-2 text-sm text-body">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      <ConfirmDialog
        open={confirmation === "delete"}
        title="Delete this service?"
        description="The listing will be removed from the marketplace catalogue. Services with bookings cannot be deleted by the API."
        confirmLabel="Delete service"
        destructive
        onConfirm={() => {
          void handleConfirmation();
        }}
        onClose={() => setConfirmation(null)}
      />
      <ConfirmDialog
        open={confirmation === "pause"}
        title={
          currentStatus === "suspended"
            ? "Activate this service?"
            : "Pause this service?"
        }
        description={
          currentStatus === "suspended"
            ? "The service will return to active status in the marketplace catalogue."
            : "The service will be marked as paused until you activate it again."
        }
        confirmLabel={currentStatus === "suspended" ? "Activate" : "Pause"}
        onConfirm={() => {
          void handleConfirmation();
        }}
        onClose={() => setConfirmation(null)}
      />
    </div>
  );
}
