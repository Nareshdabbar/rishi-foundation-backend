import { z } from "zod";

export const userRoleParamsSchema = z.object({
  userId: z.string().regex(
    /^\d+$/,
    "User ID must be a valid number.",
  ),

  roleId: z.string().regex(
    /^\d+$/,
    "Role ID must be a valid number.",
  ),
});

export type UserRoleParams = z.infer<
  typeof userRoleParamsSchema
>;