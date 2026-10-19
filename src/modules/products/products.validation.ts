import z from "zod";
import { jsonField } from "../../utils/jsonParse";
import { formBoolean } from "../../utils/booleanParse";

type Product_Status = "PENDING" | "APPROVED" | "REJECTED" | "OUT_OF_STOCK" | "ARCHIVED" | "DRAFT";

export interface IReplaceImage {
  productId: string;
  imageId: string;
  file: Express.Multer.File;
}


export interface IDeleteImage {
  productId: string;
  imageId: string;
}


export const productsZodSchema = z.object({
  specifications: jsonField(z.array(
    z.object({
      id: z.string().optional(),
      key: z.string().trim().min(1),
      value: z.string().trim().min(1),
    })
  )).optional(),

  variants: jsonField(z.array(
    z.object({
      id: z.string().optional(),
      sku: z.string().trim().min(1),
      color: z.string().optional(),
      size: z.string().optional(),
      price: z.coerce.number().nonnegative(),
      stock: z.coerce.number().int().nonnegative(),
    })
  )).optional(),
  uploadedImages: jsonField(z.array(z.object({
    url: z.string(),
    publicId: z.string()
  }))).optional(),

  categoryId: z.string().min(1),
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: z.string().optional(),
  brand: z.string().optional(),
  tags: jsonField(z.array(z.string()).default([])).optional(),
  basePrice: z.coerce.number().nonnegative(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "OUT_OF_STOCK", "ARCHIVED", "DRAFT",]).optional(),
  discountPrice: z.coerce.number().nonnegative().optional(),
  features: jsonField(z.array(z.string()).default([])).optional(),
  shippingFee: z.coerce.number().nonnegative(),
  isShippingFree: formBoolean.optional(),
  isFeatured: formBoolean.optional(),
});


export const productUpdateZodSchema = z.object({

  specifications: jsonField(
    z.array(
      z.object({
        id: z.string().min(1).optional(),
        key: z.string().trim().min(1).optional(),
        value: z.string().trim().min(1).optional(),
      })
    )
  ).optional(),

  variants: jsonField(
    z.array(
      z.object({
        id: z.string().min(1).optional(),
        sku: z.string().trim().min(1).optional(),
        color: z.string().trim().optional(),
        size: z.string().trim().optional(),
        price: z.coerce.number().finite().nonnegative().optional(),
        stock: z.coerce.number().int().nonnegative().optional(),
      })
    )
  ).optional(),

  categoryId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  slug: z.string().trim().min(1).optional(),
  description: z.string().optional(),
  brand: z.string().optional(),

  tags: jsonField(
    z.array(z.string())
  ).optional(),

  features: jsonField(
    z.array(z.string())
  ).optional(),


  basePrice: z.coerce.number().finite().nonnegative().optional(),
  discountPrice: z.coerce.number().finite().nonnegative().optional(),
  shippingFee: z.coerce.number().finite().nonnegative().optional(),


  isShippingFree: formBoolean.optional(),
  isFeatured: formBoolean.optional(),
}).strict();

export type IProductUpdate = z.infer<typeof productUpdateZodSchema>;
export type IProductCreate = z.infer<typeof productsZodSchema>;



export type InventoryQueryDTO = {
  page: number;
  limit: number;
  skip: number;
  take: number;

  search?: string;
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  sortBy?: "stock" | "createdAt" | "updatedAt";
  order?: "asc" | "desc";
};