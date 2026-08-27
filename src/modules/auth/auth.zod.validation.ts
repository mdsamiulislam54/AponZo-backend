import z from "zod";

export const createUserSchema = z.object({
    email: z.string("Email is required").email(),
    password: z.string("Password is required").min(8),
    name: z.string("Name is required").min(1),
    phone: z.string().min(1).optional(),
    role: z.string().min(1).optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})