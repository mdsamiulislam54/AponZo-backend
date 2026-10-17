
type Product_Status = "PENDING" | "APPROVED" | "REJECTED" | "OUT_OF_STOCK" | "ARCHIVED" | "DRAFT";
interface IProductCreate {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  tags: string[];
  basePrice: number;
  discountPrice?: number;
  features: string[];
  images: string[];
  shippingFee: number;
  isShippingFree: boolean;
  stock: number;
}

interface IProductUpdate {
  name?: string;
  slug?: string;
  description?: string;
  brand?: string;
  tags?: string[];
  basePrice?: number;
  discountPrice?: number;
  features?: string[];
  images?: string[];
  shippingFee?: number;
  isShippingFree?: boolean;
  stock?: number;
  status?: Product_Status;
}

export { IProductCreate, IProductUpdate };