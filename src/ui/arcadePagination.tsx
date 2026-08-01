import type { ViewChild } from "./types.js";

type ArcadePaginationProps = {
  currentPage: number;
  totalPages: number;
  genre: string;
  searchQuery: string;
  sort: string;
};

export function ArcadePagination({ currentPage, totalPages, genre, searchQuery, sort }: ArcadePaginationProps) {
  if (totalPages <= 1) return null;

  const pageRange = getPageNumbers(currentPage, totalPages);

  return (
    <nav class="pagination" aria-label="Arcade Pagination">
      {currentPage > 1 ? (
        <a class="button" href={paginationUrl(currentPage - 1, genre, searchQuery, sort)} aria-label="Previous Page">
          &larr; Prev
        </a>
      ) : (
        <span class="button button--secondary" aria-disabled="true" style="opacity: 0.5; pointer-events: none;">
          &larr; Prev
        </span>
      )}

      {pageRange.map((page, index) => {
        if (page === "...") {
          return <span key={`ellipse-${index}`} style="padding: 0 var(--space-2); font-weight: bold; color: var(--color-text-muted);">...</span>;
        }

        const isCurrent = page === currentPage;
        return (
          <a
            key={`page-${page}`}
            class={isCurrent ? "button button--selected" : "button button--secondary"}
            href={paginationUrl(page as number, genre, searchQuery, sort)}
            aria-current={isCurrent ? "page" : undefined}
          >
            {page}
          </a>
        );
      })}

      {currentPage < totalPages ? (
        <a class="button" href={paginationUrl(currentPage + 1, genre, searchQuery, sort)} aria-label="Next Page">
          Next &rarr;
        </a>
      ) : (
        <span class="button button--secondary" aria-disabled="true" style="opacity: 0.5; pointer-events: none;">
          Next &rarr;
        </span>
      )}
    </nav>
  );
}

function getPageNumbers(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: Array<number | "..."> = [];
  pages.push(1);

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

function paginationUrl(page: number, genre: string, searchQuery: string, sort: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (genre && genre !== "all") params.set("genre", genre);
  if (searchQuery && searchQuery.trim()) params.set("search", searchQuery.trim());
  if (sort && sort !== "popular") params.set("sort", sort);

  const queryString = params.toString();
  return queryString ? `/arcade?${queryString}` : "/arcade";
}