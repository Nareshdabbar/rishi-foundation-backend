import type { Request, Response } from "express";

import {
  assignUserRole,
  getUserRoles,
  removeUserRole,
} from "./user-role.service.js";

export const getUserRolesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;

    if (!userId || Array.isArray(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });

      return;
    }

    const roles = await getUserRoles(userId);

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "USER_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });

      return;
    }

    console.error(
      "Failed to fetch user roles:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user roles.",
    });
  }
};

export const assignUserRoleController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const { role_id } = req.body ?? {};

    if (
      !userId ||
      Array.isArray(userId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });

      return;
    }

    if (
      !role_id ||
      typeof role_id !== "string" ||
      !/^\d+$/.test(role_id)
    ) {
      res.status(400).json({
        success: false,
        message: "Valid role_id is required.",
      });

      return;
    }

    const userRole = await assignUserRole(
      userId,
      role_id,
    );

    res.status(201).json({
      success: true,
      data: userRole,
      message: "Role assigned successfully.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "USER_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "ROLE_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Role not found.",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "ROLE_ALREADY_ASSIGNED"
    ) {
      res.status(409).json({
        success: false,
        message: "Role already assigned to user.",
      });

      return;
    }

    console.error(
      "Failed to assign user role:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to assign user role.",
    });
  }
};

export const removeUserRoleController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId, roleId } = req.params;

    if (
      !userId ||
      Array.isArray(userId) ||
      !roleId ||
      Array.isArray(roleId)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID or role ID.",
      });

      return;
    }

    const result = await removeUserRole(
      userId,
      roleId,
    );

    res.status(200).json({
      success: true,
      data: result,
      message: "Role removed successfully.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "USER_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "ROLE_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Role not found.",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "USER_ROLE_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Role is not assigned to this user.",
      });

      return;
    }

    console.error(
      "Failed to remove user role:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to remove user role.",
    });
  }
};