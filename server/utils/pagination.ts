import type { H3Event } from 'h3';

type OrderDirection = 'ASC' | 'DESC';

/**
 * Create pagination params
 * @param req - Axios Request
 * @returns Object of pagination params - page, limit, col, direction, offset
 */
export const buildPaginationParams = (event: H3Event) => {
  const query = getQuery(event);
  const limit = parseInt(query.limit as string, 10) || 5;
  const page = parseInt(query.page as string, 10) || 1;
  const offset = limit * (page - 1);
  const col = (query.col as string) || 'id';
  const direction = (query.direction as OrderDirection) || 'ASC';
  const search = query.search || '';

  return { limit, page, col, direction, offset, search };
};
