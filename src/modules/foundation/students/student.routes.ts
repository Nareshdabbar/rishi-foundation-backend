import { Router } from "express";

import {
  createStudentRegistrationController,
  deleteStudentRegistration,
  getStudentRegistration,
  getStudentRegistrationCountController,
  getStudentRegistrations,
  updateStudentRegistration,
} from "./student.controller.js";

import { requireAuth } from "../../../middleware/auth.js";
import { requirePermission } from "../../../middleware/permission.js";

const router = Router();

/*
 * Public website
 *
 * No authentication required.
 *
 * POST /api/foundation/students
 */
router.post("/", createStudentRegistrationController);








// router.get(
//   "/count",
//   requireAuth,
//   requirePermission("foundation.students.read"),
//   getStudentRegistrationCountController,
// );

router.get(
  "/count",
  getStudentRegistrationCountController,
);


/*
 * Admin
 *
 * Authentication + permission required.
 *
 * GET /api/foundation/students
 */
router.get(
  "/",
  requireAuth,
  requirePermission("foundation.students.read"),
  getStudentRegistrations,
);

/*
 * Admin
 *
 * GET /api/foundation/students/:id
 */
router.get(
  "/:id",
  requireAuth,
  requirePermission("foundation.students.read"),
  getStudentRegistration,
);

/*
 * Admin
 *
 * PATCH /api/foundation/students/:id
 */
router.patch(
  "/:id",
  requireAuth,
  requirePermission("foundation.students.update"),
  updateStudentRegistration,
);

/*
 * Admin
 *
 * DELETE /api/foundation/students/:id
 */
router.delete(
  "/:id",
  requireAuth,
  requirePermission("foundation.students.delete"),
  deleteStudentRegistration,
);




export default router;
