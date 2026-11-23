"use client";

import { CheckCircle2, FolderTree, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { useAdminCategories } from "@/components/admin/admin-category-store";
import CategoriesTable from "@/components/admin/CategoriesTable";
import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination";
import CategoryForm, {
  CATEGORY_ICON_CHOICES,
  type CategoryFormValues,
  type CategoryIconName,
} from "@/components/forms/CategoryForm";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdminStatuses } from "@/hooks/usePortalData";
import { usePagination } from "@/hooks/usePagination";
import type { Category } from "@/types/category";

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

/** Category management with local add/edit/delete and status controls. */
export default function AdminCategoriesView() {
  const { categories, saveCategory, deleteCategory } = useAdminCategories();
  const { statuses, setStatus } = useAdminStatuses();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [message, setMessage] = useState("");
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
    setEditorOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setEditorOpen(true);
  }

  function handleSave(values: CategoryFormValues) {
    saveCategory(values, editing?.id);
    setEditorOpen(false);
    setEditing(null);
    setMessage(
      editing
        ? `${values.name} updated in this browser.`
        : `${values.name} added to this browser.`,
    );
  }

  function handleDelete() {
    if (!pendingDelete) {
      return;
    }
    deleteCategory(pendingDelete.id);
    setMessage(`${pendingDelete.name} removed from this browser.`);
    setPendingDelete(null);
  }

  function toggleStatus(category: Category) {
    const current = statuses[category.id] ?? "active";
    setStatus(category.id, current === "suspended" ? "active" : "suspended");
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

        {filtered.length > 0 ? (
          <CategoriesTable
            categories={pageItems}
            statuses={statuses}
            onEdit={openEdit}
            onDelete={setPendingDelete}
            onToggleStatus={toggleStatus}
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
        description="Category changes are stored in this browser only."
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
            ? `${pendingDelete.name} will be removed from this browser. Existing services keep their category label.`
            : ""
        }
        confirmLabel="Delete category"
        destructive
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
