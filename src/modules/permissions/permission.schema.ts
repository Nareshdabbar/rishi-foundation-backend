import { z } from "zod";

export const createPermissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Permission name is required.")
    .max(
      100,
      "Permission name must not exceed 100 characters.",
    ),

  description: z
    .string()
    .trim()
    .max(
      255,
      "Description must not exceed 255 characters.",
    )
    .nullable()
    .optional(),
});

export const updatePermissionSchema =
  createPermissionSchema;

export type CreatePermissionInput = z.infer<
  typeof createPermissionSchema
>;

export type UpdatePermissionInput = z.infer<
  typeof updatePermissionSchema
>;