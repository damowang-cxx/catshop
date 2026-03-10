"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

interface AdminPaginationProps {
  pathname: string;
  page: number;
  pageSize: number;
  total: number;
  query?: Record<string, string | undefined>;
  pageSizeOptions?: number[];
}

function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
}

export default function AdminPagination({
  pathname,
  page,
  pageSize,
  total,
  query,
  pageSizeOptions = [10, 20, 50, 100],
}: AdminPaginationProps) {
  const router = useRouter();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = clampPage(page, totalPages);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, safePage + 2);
    for (let current = start; current <= end; current += 1) {
      pages.push(current);
    }
    return pages;
  }, [safePage, totalPages]);

  const buildHref = (nextPage: number, nextPageSize = pageSize): string => {
    const params = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    params.set("page", String(clampPage(nextPage, Math.ceil(total / nextPageSize) || 1)));
    params.set("pageSize", String(nextPageSize));
    const queryString = params.toString();

    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    const href = buildHref(1, nextPageSize);
    router.push(href);
  };

  return (
    <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-600">
        Showing page {safePage} of {totalPages} ({total} total items)
      </p>

      <div className="flex items-center gap-2">
        <label htmlFor="page-size" className="text-sm text-gray-600">
          Per page
        </label>
        <select
          id="page-size"
          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          value={pageSize}
          onChange={(event) =>
            handlePageSizeChange(Number.parseInt(event.target.value, 10))
          }
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Link
          className={`rounded-md border px-3 py-1 text-sm ${
            safePage <= 1
              ? "pointer-events-none border-gray-200 text-gray-400"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          href={buildHref(safePage - 1)}
        >
          Prev
        </Link>

        {pageNumbers.map((pageNumber) => (
          <Link
            key={pageNumber}
            className={`rounded-md border px-3 py-1 text-sm ${
              pageNumber === safePage
                ? "border-amber-700 bg-amber-700 text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            href={buildHref(pageNumber)}
          >
            {pageNumber}
          </Link>
        ))}

        <Link
          className={`rounded-md border px-3 py-1 text-sm ${
            safePage >= totalPages
              ? "pointer-events-none border-gray-200 text-gray-400"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          href={buildHref(safePage + 1)}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

