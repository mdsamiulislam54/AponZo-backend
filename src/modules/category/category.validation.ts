import z from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required").optional(),
    icon: z.string().min(1, "Icon is required").optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    parentId: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;



