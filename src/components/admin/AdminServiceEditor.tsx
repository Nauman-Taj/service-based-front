"use client";

import { ArrowLeft, CheckCircle2, Pause, Play, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, type FormEvent } from "react";

import { useAdminCategories } from "@/components/admin/admin-category-store";
import {
  useAdminServiceOverrides,
  type ServiceOverride,
} from "@/components/admin/admin-service-overrides";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import Badge from "@/components/common/Badge";
import Button, { ButtonLink } from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Textarea from "@/components/common/Textarea";
import { useAdminStatuses } from "@/hooks/usePortalData";
import { formatCurrency } from "@/utils/formatCurrency";

export default function AdminServiceEditor() {
  const params = useParams<{ serviceId: string }>();
  const serviceId =
    typeof params.serviceId === "string" ? params.serviceId : "";

  return <ServiceEditorInner key={serviceId} serviceId={serviceId} />;
}

function ServiceEditorInner({ serviceId }: { serviceId: string }) {
  const router = useRouter();
  const { getServiceById, saveService, deleteService } =
    useAdminServiceOverrides();
  const { categories } = useAdminCategories();
  const { statuses, setStatus } = useAdminStatuses();
  const service = getServiceById(serviceId);

  const [form, setForm] = useState<ServiceOverride>({
    title: service?.title ?? "",
    description: service?.description ?? "",
    price: service?.price ?? 0,
    categorySlug: service?.categorySlug ?? "",
    categoryName: service?.categoryName ?? "",
    featured: service?.featured ?? false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState<"delete" | "pause" | null>(
    null,
  );

  const currentStatus = statuses[serviceId] ?? "active";

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
    if (form.title.trim().length < 3) {
      next.title = "Enter a service title of at least 3 characters.";
    }
    if (form.description.trim().length < 10) {
      next.description = "Describe the service in at least 10 characters.";
    }
    if (!Number.isFinite(form.price) || form.price <= 0) {
      next.price = "Enter a price greater than zero.";
    }
    if (!form.categorySlug) {
      next.categorySlug = "Choose a service category.";
    }
    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const selectedCategory = categories.find(
      (category) => category.slug === form.categorySlug,
    );
    saveService(serviceId, {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      price: Math.round(form.price),
      categoryName: selectedCategory?.name ?? form.categoryName,
    });
    setMessage("Service changes saved to this browser.");
  }

  function handleConfirmation() {
    if (confirmation === "delete") {
      deleteService(serviceId);
      router.push("/admin/services");
      return;
    }

    if (confirmation === "pause") {
      const next = currentStatus === "suspended" ? "active" : "suspended";
      setStatus(serviceId, next);
      setMessage(
        next === "suspended"
          ? "Service paused. It is no longer active in the admin catalogue."
          : "Service activated.",
      );
    }
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
          description="This service is not in the local catalogue. It may have been removed by an administrator."
          action={
            <ButtonLink href="/admin/services" size="sm">
              View all services
            </ButtonLink>
          }
        />
      </div>
    );
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
            Saved changes appear in the admin services table immediately.
          </p>

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
                variant="secondary"
                onClick={() => setConfirmation("delete")}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </Button>
              <Button type="submit">Save changes</Button>
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
        description="The listing will be removed from the admin catalogue. This affects this browser only."
        confirmLabel="Delete service"
        destructive
        onConfirm={handleConfirmation}
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
            ? "The service will return to active status in the admin catalogue."
            : "The service will be marked as paused until you activate it again."
        }
        confirmLabel={currentStatus === "suspended" ? "Activate" : "Pause"}
        onConfirm={handleConfirmation}
        onClose={() => setConfirmation(null)}
      />
    </div>
  );
}
