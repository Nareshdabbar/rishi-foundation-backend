import { Router } from "express";

import {
  createRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole,
} from "./role.controller.js";

import {
  createRoleSchema,
  updateRoleSchema,
} from "./role.schema.js";

import { validate } from "../../middleware/validate.js";

const router = Router();

router.get("/", getRoles);

router.get("/:id", getRole);

router.post(
  "/",
  validate(createRoleSchema),
  createRole,
);

router.patch(
  "/:id",
  validate(updateRoleSchema),
  updateRole,
);

router.delete("/:id", deleteRole);

export default router;