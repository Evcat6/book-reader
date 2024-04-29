export type LoadPaginatedResponse<T> = {
  data: T;
  meta: {
    page: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    itemCount: number;
    pageCount: number;
  };
};
