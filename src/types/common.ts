export interface PaginationQueryDto {
  offset?: string;
  limit?: string;
  orderBy?: string;
  keyword?: string;
}

export interface PaginationMeta {
  total: number;
  pages: number;
  offset: number;
  limit: number;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMeta;
}