import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  getUserPermissions,
} from "../modules/permissions/permission.service.js";

import type {
  AuthenticatedRequest,
} from "./auth.js";

export const requirePermission = (
  permissionName: string,
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authenticatedRequest =
        req as AuthenticatedRequest;

      if (!authenticatedRequest.user) {
        res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });

        return;
      }

      const permissions =
        await getUserPermissions(
          authenticatedRequest.user.id,
        );

      const hasPermission =
        permissions.includes(
          permissionName,
        );

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          message:
            "You do not have permission to perform this action.",
        });

        return;
      }

      next();
    } catch (error) {
      console.error(
        "Permission check failed:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to verify permission.",
      });
    }
  };
};