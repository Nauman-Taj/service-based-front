"use client";

import { CheckCircle2, FolderTree, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { useAdminCategories } from "@/components/admin/admin-category-store";
import CategoriesTable from "@/components/admin/CategoriesTable";
import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination";
import CategoryForm, {
  CATEGORY_ICON_CHOICES,
  type CategoryFormValues,
  type CategoryIconName,
} from "@/components/forms/CategoryForm";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import type { Category } from "@/types/category";
import type { AdminEntityStatus } from "@/types/dashboard";

const SLUG_ICON_FALLBACKS: Record<string, CategoryIconName> = {
  "home-cleaning": "Sparkles",
  plumbing: "Wrench",
  electrical: "Zap",
  painting: "Paintbrush",
  gardening: "Leaf",
  carpentry: "Hammer",
  moving: "Truck",
  "appliance-repair": "WashingMachine",
};

function iconNameFor(category: Category): CategoryIconName {
  const match = CATEGORY_ICON_CHOICES.find(
    (choice) => choice.icon === category.icon,
  );
  return match?.value ?? SLUG_ICON_FALLBACKS[category.slug] ?? "Sparkles";
}

function describeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "We could not update this category. Please try again.";
}

/** API-backed category management with live service counts and status controls. */
export default function AdminCategoriesView() {
  const {
    categories,
    statuses,
    loading,
    error,
    saveCategory,
    deleteCategory,
    setCategoryStatus,
  } = useAdminCategories();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const query = useDebounce(search, 250).trim().toLowerCase();

  const filtered = useMemo(
    () =>
      categories.filter((category) =>
        [category.name, category.slug, category.description].some((value) =>
          value.toLowerCase().includes(query),
        ),
      ),
    [categories, query],
  );

  const { page, pageItems, totalPages, setPage } = usePagination(filtered, 8);

  function openAdd() {
    setEditing(null);
    setActionError(null);
    setEditorOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setActionError(null);
    setEditorOpen(true);
  }

  async function handleSave(values: CategoryFormValues) {
    setActionError(null);
    try {
      await saveCategory(values, editing?.id);
      setEditorOpen(false);
      setEditing(null);
      setMessage(
        editing
          ? `${values.name} updated in the catalogue.`
          : `${values.name} added to the catalogue.`,
      );
    } catch (requestError) {
      setActionError(describeError(requestError));
    }
  }

  async function handleDelete() {
    if (!pendingDelete) {
      return;
    }
    const category = pendingDelete;
    setPendingDelete(null);
    setActionError(null);
    try {
      await deleteCategory(category.id);
      setMessage(`${category.name} removed from the catalogue.`);
    } catch (requestError) {
      setActionError(describeError(requestError));
    }
  }

  async function toggleStatus(category: Category) {
    const current = statuses[category.id] ?? "active";
    const next: AdminEntityStatus =
      current === "suspended" ? "active" : "suspended";
    setActionError(null);
    try {
      await setCategoryStatus(category.id, next);
    } catch (requestError) {
      setActionError(describeError(requestError));
    }
  }

  return (
    <div className="space-y-6">
      <DashboardIntro
        title="Service categories"
        description="Organise the marketplace catalogue and keep category listings accurate."
        action={
          <Button onClick={openAdd} size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add category
          </Button>
        }
      />

      {message ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {message}
        </p>
      ) : null}

      {error || actionError ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {actionError ?? error}
        </p>
      ) : null}

      <section className="rounded-2xl border border-line bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
          <div className="relative w-full max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories"
              aria-label="Search categories"
              className="h-11 w-full rounded-xl border border-line bg-card pl-10 pr-3 text-sm text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <p className="text-sm text-muted">
            {filtered.length} {filtered.length === 1 ? "category" : "categories"}
          </p>
        </div>

        {loading ? (
          <div className="p-5">
            <LoadingSpinner className="py-12" label="Loading categories…" />
          </div>
        ) : filtered.length > 0 ? (
          <CategoriesTable
            categories={pageItems}
            statuses={statuses}
            onEdit={openEdit}
            onDelete={setPendingDelete}
            onToggleStatus={(category) => {
              void toggleStatus(category);
            }}
          />
        ) : (
          <div className="p-5">
            <EmptyState
              icon={FolderTree}
              title="No categories found"
              description="Try another search or add a new service category."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </Button>
                  <Button size="sm" onClick={openAdd}>
                    Add category
                  </Button>
                </div>
              }
            />
          </div>
        )}
      </section>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
        className="pt-1"
      />

      <Modal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editing ? "Edit category" : "Add category"}
        description="Changes are saved to the marketplace catalogue and appear across Quicker."
        className="max-w-xl"
      >
        <CategoryForm
          key={editing?.id ?? "new-category"}
          initialValues={
            editing
              ? {
                  name: editing.name,
                  slug: editing.slug,
                  description: editing.description,
                  icon: iconNameFor(editing),
                }
              : null
          }
          existingSlugs={categories
            .filter((category) => category.id !== editing?.id)
            .map((category) => category.slug)}
          onSubmit={handleSave}
          onCancel={() => setEditorOpen(false)}
          submitLabel={editing ? "Update category" : "Add category"}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this category?"
        description={
          pendingDelete
            ? `${pendingDelete.name} will be removed from the marketplace catalogue. Categories with services must be emptied first.`
            : ""
        }
        confirmLabel="Delete category"
        destructive
        onConfirm={() => {
          void handleDelete();
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
