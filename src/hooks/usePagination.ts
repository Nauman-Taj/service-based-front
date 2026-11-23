"use client";

import { useCallback, useMemo, useState } from "react";

/** Simple client-side pagination with a page number clamped to the data size. */
export function usePagination<T>(items: T[], pageSize = 8) {
  const [requestedPage, setRequestedPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, totalPages);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  const setPage = useCallback((next: number) => {
    setRequestedPage(Math.max(1, next));
  }, []);

  return {
    page,
    pageItems,
    totalPages,
    setPage,
    nextPage: () => setPage(page + 1),
    previousPage: () => setPage(page - 1),
  };
}
