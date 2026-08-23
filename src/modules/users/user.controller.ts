import type { Request, Response } from "express";

import {
  createUserSchema,
  updateUserSchema,
} from "./user.schema.js";

import {
  createNewUser,
  deleteExistingUser,
  updateExistingUser,
} from "./user.service.js";

import {
  findAllUsers,
  findUserById,
} from "./user.repository.js";

export const createUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = createUserSchema.safeParse(
      req.body ?? {},
    );

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request data.",
        errors: validation.error.issues.map(
          (issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          }),
        ),
      });

      return;
    }

    const user = await createNewUser(
      validation.data,
    );

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "USER_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        message: "User already exists.",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "INVALID_ROLE_IDS"
    ) {
      res.status(400).json({
        success: false,
        message: "One or more role IDs are invalid.",
      });

      return;
    }

    console.error(
      "Failed to create user:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to create user.",
    });
  }
};

export const getUsers = async (
  _req: Request,
  res: Response,
) => {
  try {
    const users = await findAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(
      "Failed to fetch users:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};

export const getUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });

      return;
    }

    const rows = await findUserById(id);

    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });

      return;
    }

    const first = rows[0];

    const user = {
      id: first.id,
      first_name: first.first_name,
      last_name: first.last_name,
      email: first.email,
      is_active: first.is_active,
      created_at: first.created_at,
      updated_at: first.updated_at,

      roles: rows
        .filter(
          (row) => row.role_id !== null,
        )
        .map((row) => ({
          id: row.role_id,
          name: row.role_name,
          description: row.role_description,
        })),
    };

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "Failed to fetch user:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });

      return;
    }

    const validation = updateUserSchema.safeParse(
      req.body ?? {},
    );

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request data.",
        errors: validation.error.issues.map(
          (issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          }),
        ),
      });

      return;
    }

    const user = await updateExistingUser(
      id,
      validation.data,
    );

    res.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully.",
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
      error.message === "USER_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        message: "User already exists.",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "INVALID_ROLE_IDS"
    ) {
      res.status(400).json({
        success: false,
        message: "One or more role IDs are invalid.",
      });

      return;
    }

    console.error(
      "Failed to update user:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to update user.",
    });
  }
};


export const deleteUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });

      return;
    }

    const user = await deleteExistingUser(id);

    res.status(200).json({
      success: true,
      data: user,
      message: "User deleted successfully.",
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
      "Failed to delete user:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
};