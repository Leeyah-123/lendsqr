type PaginationResponse = {
  limit: number;
  page: number;
  totalPages: number;
  count: number;
};

export default class BaseService {
  getPagination(
    page: number,
    limit: number,
    total: number,
    count: number
  ): PaginationResponse {
    const totalPages = Math.ceil(total / limit);
    if (page > totalPages) page = totalPages;

    return {
      limit,
      page,
      totalPages,
      count,
    };
  }
}
