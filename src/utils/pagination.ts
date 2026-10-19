import { InventoryQueryDTO } from "../modules/products/products.validation";

export interface PaginationDTO {
    page: number;
    limit: number;
    skip: number;
    take: number;
}


export const getPagination = (
  query: Record<string, unknown>,
): InventoryQueryDTO => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));

  return {
    ...query,
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  } as InventoryQueryDTO;
};