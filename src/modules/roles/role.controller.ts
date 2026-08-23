import type { Request, Response } from "express";

import {
  createNewRole,
  deleteExistingRole,
  getAllRoles,
  getRoleById,
  updateExistingRole,
} from "./role.service.js";



export const getRoles = async (
  _req: Request,
  res: Response,
) => {
  try {
    const roles = await getAllRoles();

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error("Failed to fetch roles:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch roles.",
    });
  }
};

export const getRole = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid role ID.",
      });

      return;
    }

    const role = await getRoleById(id);

    if (!role) {
      res.status(404).json({
        success: false,
        message: "Role not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error("Failed to fetch role:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch role.",
    });
  }
};

export const createRole = async (
  req: Request,
  res: Response,
) => {
  try {
    const { name, description } = req.body;

    const role = await createNewRole(
      name,
      description?.trim() || null,
    );

    res.status(201).json({
      success: true,
      data: role,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "ROLE_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        message: "Role already exists.",
      });

      return;
    }

    console.error("Failed to create role:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create role.",
    });
  }
};

export const updateRole = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid role ID.",
      });

      return;
    }

    const { name, description } = req.body;

    const role = await updateExistingRole(
      id,
      name,
      description?.trim() || null,
    );

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
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
      error.message === "ROLE_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        message: "Role already exists.",
      });

      return;
    }

    console.error("Failed to update role:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update role.",
    });
  }
};

export const deleteRole = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid role ID.",
      });

      return;
    }

    const role = await deleteExistingRole(id);

    res.status(200).json({
      success: true,
      data: role,
      message: "Role deleted successfully.",
    });
  } catch (error) {
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

    console.error("Failed to delete role:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete role.",
    });
  }
};