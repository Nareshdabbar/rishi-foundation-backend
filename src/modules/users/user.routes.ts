import { Router } from "express";

import { requireAuth } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/permission.js";

import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "./user.controller.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  requirePermission("student.view"),
  getUsers,
);

router.get(
  "/:id",
  requireAuth,
  requirePermission("student.view"),
  getUser,
);

router.post(
  "/",
  requireAuth,
  requirePermission("student.create"),
  createUser,
);

router.put(
  "/:id",
  requireAuth,
  requirePermission("student.update"),
  updateUser,
);


router.delete(
  "/:id",
  requireAuth,
  requirePermission("student.update"),
  deleteUser,
);

export default router;