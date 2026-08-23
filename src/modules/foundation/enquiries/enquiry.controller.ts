import type {
  Request,
  Response,
} from "express";

import {
  createEnquirySchema,
  updateEnquirySchema,
} from "./enquiry.schema.js";

import {
  createNewEnquiry,
  deleteExistingEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateExistingEnquiry,
} from "./enquiry.service.js";

/*
 * Public website
 * POST /api/foundation/enquiries
 */
export const createEnquiryController =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const validation =
        createEnquirySchema.safeParse(
          req.body ?? {},
        );

      if (!validation.success) {
        res.status(400).json({
          success: false,
          message:
            "Invalid request data.",
          errors:
            validation.error.issues.map(
              (issue) => ({
                field:
                  issue.path.join("."),
                message:
                  issue.message,
              }),
            ),
        });

        return;
      }

      const enquiry =
        await createNewEnquiry(
          validation.data,
        );

      res.status(201).json({
        success: true,
        data: {
          id: enquiry.id,
          status: enquiry.status,
          created_at:
            enquiry.created_at,
        },
        message:
          "Your enquiry has been received successfully.",
      });
    } catch (error) {
      console.error(
        "Failed to create enquiry:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to submit enquiry.",
      });
    }
  };

/*
 * Admin
 * GET /api/foundation/enquiries
 */
export const getEnquiries =
  async (
    _req: Request,
    res: Response,
  ) => {
    try {
      const enquiries =
        await getAllEnquiries();

      res.status(200).json({
        success: true,
        data: enquiries,
      });
    } catch (error) {
      console.error(
        "Failed to fetch enquiries:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch enquiries.",
      });
    }
  };

/*
 * Admin
 * GET /api/foundation/enquiries/:id
 */
export const getEnquiry =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        res.status(400).json({
          success: false,
          message:
            "Invalid enquiry ID.",
        });

        return;
      }

      const enquiry =
        await getEnquiryById(id);

      res.status(200).json({
        success: true,
        data: enquiry,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "ENQUIRY_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Enquiry not found.",
        });

        return;
      }

      console.error(
        "Failed to fetch enquiry:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch enquiry.",
      });
    }
  };

/*
 * Admin
 * PATCH /api/foundation/enquiries/:id
 */
export const updateEnquiry =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        res.status(400).json({
          success: false,
          message:
            "Invalid enquiry ID.",
        });

        return;
      }

      const validation =
        updateEnquirySchema.safeParse(
          req.body ?? {},
        );

      if (!validation.success) {
        res.status(400).json({
          success: false,
          message:
            "Invalid request data.",
          errors:
            validation.error.issues.map(
              (issue) => ({
                field:
                  issue.path.join("."),
                message:
                  issue.message,
              }),
            ),
        });

        return;
      }

      const enquiry =
        await updateExistingEnquiry(
          id,
          validation.data,
        );

      res.status(200).json({
        success: true,
        data: enquiry,
        message:
          "Enquiry updated successfully.",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "ENQUIRY_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Enquiry not found.",
        });

        return;
      }

      console.error(
        "Failed to update enquiry:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update enquiry.",
      });
    }
  };

/*
 * Admin
 * DELETE /api/foundation/enquiries/:id
 */
export const deleteEnquiryController =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        res.status(400).json({
          success: false,
          message:
            "Invalid enquiry ID.",
        });

        return;
      }

      const enquiry =
        await deleteExistingEnquiry(
          id,
        );

      res.status(200).json({
        success: true,
        data: {
          id: enquiry.id,
        },
        message:
          "Enquiry deleted successfully.",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "ENQUIRY_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Enquiry not found.",
        });

        return;
      }

      console.error(
        "Failed to delete enquiry:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete enquiry.",
      });
    }
  };