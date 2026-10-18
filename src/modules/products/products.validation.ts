import z from "zod";
import { jsonField } from "../../utils/jsonParse";
import { formBoolean } from "../../utils/booleanParse";

type Product_Status = "PENDING" | "APPROVED" | "REJECTED" | "OUT_OF_STOCK" | "ARCHIVED" | "DRAFT";
interface IProductCreate {
  specifications?: IProductSpecification[];
  variants?: IProductVariant[];
  uploadedImages: { url: string, publicId: string }[];
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  brand?: string;
  tags: string[];
  basePrice: number;
  discountPrice?: number;
  features: string[];
  shippingFee: number;
  isShippingFree: boolean;
  isFeatured: boolean;
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
  isFeatured?: boolean;
}

interface IProductSpecification {
  productId: string;
  key: string;
  value: string;
}

interface IProductVariant {
  productId: string;
  sku: string;
  color?: string;
  size?: string;
  price: number;
  stock: number;
}




export { IProductCreate, IProductUpdate };


export const productsZodSchema = z.object({
  specifications: jsonField(z.array(
    z.object({
      key: z.string().trim().min(1),
      value: z.string().trim().min(1),
    })
  )).optional(),

  variants: jsonField(z.array(
    z.object({
      sku: z.string().trim().min(1),
      color: z.string().optional(),
      size: z.string().optional(),
      price: z.coerce.number().nonnegative(),
      stock: z.coerce.number().int().nonnegative(),
    })
  )).optional(),

  categoryId: z.string().min(1),
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: z.string().optional(),
  brand: z.string().optional(),
  tags: jsonField(z.array(z.string()).default([])).optional(),
  basePrice: z.coerce.number().nonnegative(),
  discountPrice: z.coerce.number().nonnegative().optional(),
  features: jsonField(z.array(z.string()).default([])).optional(),
  shippingFee: z.coerce.number().nonnegative(),
  isShippingFree: formBoolean.optional(),
  isFeatured: formBoolean.optional(),
});