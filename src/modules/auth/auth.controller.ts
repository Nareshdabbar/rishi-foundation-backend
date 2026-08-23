import type {
  Request,
  Response,
} from "express";

import type {
  AuthenticatedRequest,
} from "../../middleware/auth.js";
import { loginSchema } from "./auth.schema.js";

import {
  getCurrentUser,
  loginUser,
} from "./auth.service.js";

export const login = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation =
      loginSchema.safeParse(
        req.body ?? {},
      );

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request data.",
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

    const result = await loginUser(
      validation.data,
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Login successful.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "INVALID_CREDENTIALS"
    ) {
      res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        "USER_INACTIVE"
    ) {
      res.status(403).json({
        success: false,
        message:
          "User account is inactive.",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        "USER_NOT_FOUND"
    ) {
      res.status(401).json({
        success: false,
        message:
          "User account is unavailable.",
      });

      return;
    }

    console.error(
      "Login failed:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

export const me = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
   const userId =
  req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const user =
      await getCurrentUser(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "USER_NOT_FOUND"
    ) {
      res.status(401).json({
        success: false,
        message:
          "User not found or inactive.",
      });

      return;
    }

    console.error(
      "Failed to fetch current user:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch current user.",
    });
  }
};