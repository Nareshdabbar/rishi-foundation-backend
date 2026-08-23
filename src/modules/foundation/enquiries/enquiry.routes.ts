import { Router } from "express";

import {
  createEnquiryController,
  deleteEnquiryController,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
} from "./enquiry.controller.js";

import { requireAuth } from "../../../middleware/auth.js";
import {
  requirePermission,
} from "../../../middleware/permission.js";

const router = Router();

/*
 * Public website
 *
 * No authentication required.
 */
router.post(
  "/",
  createEnquiryController,
);

/*
 * Admin
 *
 * Authentication + permission required.
 */
router.get(
  "/",
  requireAuth,
  requirePermission(
    "foundation.enquiries.read",
  ),
  getEnquiries,
);

router.get(
  "/:id",
  requireAuth,
  requirePermission(
    "foundation.enquiries.read",
  ),
  getEnquiry,
);

router.patch(
  "/:id",
  requireAuth,
  requirePermission(
    "foundation.enquiries.update",
  ),
  updateEnquiry,
);

router.delete(
  "/:id",
  requireAuth,
  requirePermission(
    "foundation.enquiries.delete",
  ),
  deleteEnquiryController,
);

export default router;