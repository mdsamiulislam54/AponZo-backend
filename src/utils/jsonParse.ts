import { z } from "zod";

export const jsonField = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value, ctx) => {
    if (typeof value !== "string") {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch {
      ctx.addIssue({
        code: "custom",
        message: "Invalid JSON format",
      });

      return z.NEVER;
    }
  }, schema);