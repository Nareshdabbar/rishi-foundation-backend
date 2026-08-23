import { z } from "zod";

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Role name is required.")
    .max(100, "Role name must not exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters.")
    .nullable()
    .optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;


export const updateRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Role name is required.")
    .max(100, "Role name must not exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters.")
    .nullable()
    .optional(),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
