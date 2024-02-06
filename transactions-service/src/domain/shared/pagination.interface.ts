export type PaginationInput = {
  limit?: number;
  page?: number;
};

export type PaginatedResult<T = unknown> = {
  data: T[];
  metadata: {
    pageCount: number;
    totalCount: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
  };
};
