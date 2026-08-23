import { z } from "zod";

export const createUserSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name must not exceed 100 characters."),

  last_name: z
    .string()
    .trim()
    .max(100, "Last name must not exceed 100 characters.")
    .nullable()
    .optional(),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(255, "Email must not exceed 255 characters.")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must not exceed 100 characters."),

  role_ids: z
    .array(
      z
        .string()
        .regex(
          /^\d+$/,
          "Role ID must be a valid number.",
        ),
    )
    .min(1, "At least one role is required."),
});

export type CreateUserInput = z.infer<
  typeof createUserSchema
>;
export const updateUserSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name must not exceed 100 characters.")
    .optional(),

  last_name: z
    .string()
    .trim()
    .max(100, "Last name must not exceed 100 characters.")
    .nullable()
    .optional(),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(255, "Email must not exceed 255 characters.")
    .transform((value) => value.toLowerCase())
    .optional(),

  is_active: z
    .boolean()
    .optional(),

  role_ids: z
    .array(
      z.string().regex(
        /^\d+$/,
        "Role ID must be a valid number.",
      ),
    )
    .min(1, "At least one role is required.")
    .optional(),
});

export type UpdateUserInput = z.infer<
  typeof updateUserSchema
>;