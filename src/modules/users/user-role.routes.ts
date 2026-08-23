import { Router } from "express";

import { requireAuth } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/permission.js";

import {
  getUserRolesController,
  assignUserRoleController,
  removeUserRoleController,
} from "./user-role.controller.js";

const router = Router();

router.get(
  "/:userId/roles",
  requireAuth,
  requirePermission("student.view"),
  getUserRolesController,
);

router.post(
  "/:userId/roles",
  requireAuth,
  requirePermission("student.update"),
  assignUserRoleController,
);

router.delete(
  "/:userId/roles/:roleId",
  requireAuth,
  requirePermission("student.update"),
  removeUserRoleController,
);

export default router;