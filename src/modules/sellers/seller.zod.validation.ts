import z from "zod";
type BUSINESS_TYPE = "INDIVIDUAL" | "COMPANY" | "PARTNERSHIP";
type SELLER_ADDRESS_TYPE = "PICKUP" | "RETURN" 
export const sellerAddressSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    phone: z.string().min(1, { message: "Phone is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    district: z.string().min(1, { message: "District is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    zipcode: z.string().min(1, { message: "Postal Code is required" }),
    type: z.enum(["PICKUP", "RETURN"]).optional(),
    isDefault: z.boolean().optional()
})

export const sellerAddressSchemaUpdate = z.object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    phone: z.string().min(1, { message: "Phone is required" }).optional(),
    address: z.string().min(1, { message: "Address is required" }).optional(),
    city: z.string().min(1, { message: "City is required" }).optional(),
    district: z.string().min(1, { message: "District is required" }).optional(),
    country: z.string().min(1, { message: "Country is required" }).optional(),
    zipcode: z.string().min(1, { message: "Postal Code is required" }).optional(),
    type: z.enum(["PICKUP", "RETURN"]).optional(),
    isDefault: z.boolean().optional()
})
export const sellerDocumentSchema = z.object({
    type: z.string().min(1, { message: "Document Type is required" }),
    documentNumber: z.string().min(1, { message: "Document Number is required" }),
    documentUrl: z.string().min(1, { message: "Document URL is required" }),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    rejectionReason: z.string().min(1, { message: "Rejection Reason is required" }).optional(),
    reviewedBy: z.string().min(1, { message: "Reviewed By is required" }).optional(),
    reviewedAt: z.string().optional()
})

export const sellerDocumentUpdateSchema = z.object({
    type: z.string().min(1, { message: "Document Type is required" }).optional(),
    documentNumber: z.string().min(1, { message: "Document Number is required" }).optional(),
    documentUrl: z.string().min(1, { message: "Document URL is required" }).optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    rejectionReason: z.string().min(1, { message: "Rejection Reason is required" }).optional(),
    reviewedBy: z.string().min(1, { message: "Reviewed By is required" }).optional(),
    reviewedAt: z.string().optional()
})

export type sellerDocumentType = z.infer<typeof sellerDocumentSchema>
export type sellerDocumentUpdateType = z.infer<typeof sellerDocumentUpdateSchema>
export type sellerAddressType = z.infer<typeof sellerAddressSchema>
export type sellerAddressUpdateType = z.infer<typeof sellerAddressSchemaUpdate>