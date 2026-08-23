import type { Request, Response } from "express";

import {
  createPermissionSchema,
  updatePermissionSchema,
} from "./permission.schema.js";

import {
  createNewPermission,
  deleteExistingPermission,
  getAllPermissions,
  getPermission,
  updateExistingPermission,
} from "./permission.service.js";

export const getPermissions = async (
  _req: Request,
  res: Response,
) => {
  try {
    const permissions =
      await getAllPermissions();

    res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    console.error(
      "Failed to fetch permissions:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch permissions.",
    });
  }
};

export const getPermissionById =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;

      if (
        !id ||
        Array.isArray(id)
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid permission ID.",
        });

        return;
      }

      const permission =
        await getPermission(id);

      if (!permission) {
        res.status(404).json({
          success: false,
          message: "Permission not found.",
        });

        return;
      }

      res.status(200).json({
        success: true,
        data: permission,
      });
    } catch (error) {
      console.error(
        "Failed to fetch permission:",
        error,
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch permission.",
      });
    }
  };

export const createPermissionController =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const validation =
        createPermissionSchema.safeParse(
          req.body ?? {},
        );

      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Invalid request data.",
          errors:
            validation.error.issues.map(
              (issue) => ({
                field: issue.path.join("."),
                message: issue.message,
              }),
            ),
        });

        return;
      }

      const permission =
        await createNewPermission(
          validation.data,
        );

      res.status(201).json({
        success: true,
        data: permission,
        message:
          "Permission created successfully.",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "PERMISSION_ALREADY_EXISTS"
      ) {
        res.status(409).json({
          success: false,
          message:
            "Permission already exists.",
        });

        return;
      }

      console.error(
        "Failed to create permission:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create permission.",
      });
    }
  };

export const updatePermissionController =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;

      if (
        !id ||
        Array.isArray(id)
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid permission ID.",
        });

        return;
      }

      const validation =
        updatePermissionSchema.safeParse(
          req.body ?? {},
        );

      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Invalid request data.",
          errors:
            validation.error.issues.map(
              (issue) => ({
                field: issue.path.join("."),
                message: issue.message,
              }),
            ),
        });

        return;
      }

      const permission =
        await updateExistingPermission(
          id,
          validation.data,
        );

      res.status(200).json({
        success: true,
        data: permission,
        message:
          "Permission updated successfully.",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "PERMISSION_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Permission not found.",
        });

        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "PERMISSION_ALREADY_EXISTS"
      ) {
        res.status(409).json({
          success: false,
          message:
            "Permission already exists.",
        });

        return;
      }

      console.error(
        "Failed to update permission:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update permission.",
      });
    }
  };

export const deletePermissionController =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { id } = req.params;

      if (
        !id ||
        Array.isArray(id)
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid permission ID.",
        });

        return;
      }

      const permission =
        await deleteExistingPermission(id);

      res.status(200).json({
        success: true,
        data: permission,
        message:
          "Permission deleted successfully.",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "PERMISSION_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Permission not found.",
        });

        return;
      }

      console.error(
        "Failed to delete permission:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete permission.",
      });
    }
  };