import { Router } from "express";

import { requireAuth } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/permission.js";

import {
  createPermissionController,
  deletePermissionController,
  getPermissionById,
  getPermissions,
  updatePermissionController,
} from "./permission.controller.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  requirePermission("content.view"),
  getPermissions,
);

router.get(
  "/:id",
  requireAuth,
  requirePermission("content.view"),
  getPermissionById,
);

router.post(
  "/",
  requireAuth,
  requirePermission("content.create"),
  createPermissionController,
);

router.put(
  "/:id",
  requireAuth,
  requirePermission("content.update"),
  updatePermissionController,
);

router.delete(
  "/:id",
  requireAuth,
  requirePermission("content.update"),
  deletePermissionController,
);

export default router;