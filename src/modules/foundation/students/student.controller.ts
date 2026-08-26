import type { Request, Response } from "express";

import type {
  StudentRegistrationResponse,
  StudentRegistrationListResponse,
  StudentRegistrationDetailResponse,
  UpdateStudentRegistrationResponse,
  DeleteStudentRegistrationResponse,
  StudentRegistrationCountResponse,
} from "@rishi-foundation/contracts";

import {
  createStudentRegistrationSchema,
  updateStudentRegistrationSchema,
} from "./student.schema.js";

import {
  createNewStudentRegistration,
  deleteExistingStudentRegistration,
  getAllStudentRegistrations,
  getStudentRegistrationById,
  getStudentRegistrationCount,
  updateExistingStudentRegistration,
} from "./student.service.js";

/*
 * Public website
 * POST /api/foundation/students
 */
// 1. CREATE
export const createStudentRegistrationController = async (
  req: Request,
  res: Response<StudentRegistrationResponse>,
) => {
  try {
    const validation = createStudentRegistrationSchema.safeParse(
      req.body ?? {},
    );

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request data.",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    const registration = await createNewStudentRegistration(validation.data);

    res.status(201).json({
      success: true,
      data: {
        id: registration.id,
      },
      message: "Registration submitted successfully.",
    });
  } catch (error) {
    console.error("Failed to create student registration:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit registration.",
    });
  }
};

/*
 * Admin
 * GET /api/foundation/students
 */
// 2. GET ALL
export const getStudentRegistrations = async (
  _req: Request,
  res: Response<StudentRegistrationListResponse>,
) => {
  try {
    const registrations = await getAllStudentRegistrations();

    res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error("Failed to fetch student registrations:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch registrations.",
    });
  }
};

/*
 * Admin
 * GET /api/foundation/students/:id
 */
// 3. GET ONE
export const getStudentRegistration = async (
  req: Request,
  res: Response<StudentRegistrationDetailResponse>,
) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid registration ID.",
      });

      return;
    }

    const registration = await getStudentRegistrationById(id);

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "STUDENT_REGISTRATION_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Registration not found.",
      });

      return;
    }

    console.error("Failed to fetch student registration:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch registration.",
    });
  }
};

/*
 * Admin
 * PATCH /api/foundation/students/:id
 */
// 4. UPDATE
export const updateStudentRegistration = async (
  req: Request,
  res: Response<UpdateStudentRegistrationResponse>,
) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid registration ID.",
      });

      return;
    }

    const validation = updateStudentRegistrationSchema.safeParse(
      req.body ?? {},
    );

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request data.",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    const registration = await updateExistingStudentRegistration(
      id,
      validation.data,
    );

    res.status(200).json({
      success: true,
      data: registration,
      message: "Registration updated successfully.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "STUDENT_REGISTRATION_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Registration not found.",
      });

      return;
    }

    console.error("Failed to update student registration:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update registration.",
    });
  }
};

/*
 * Admin
 * DELETE /api/foundation/students/:id
 */
// 5. DELETE
export const deleteStudentRegistration = async (
  req: Request,
  res: Response<DeleteStudentRegistrationResponse>,
) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid registration ID.",
      });

      return;
    }

    const registration = await deleteExistingStudentRegistration(id);

    res.status(200).json({
      success: true,
      data: {
        id: registration.id,
      },
      message: "Registration deleted successfully.",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "STUDENT_REGISTRATION_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Registration not found.",
      });

      return;
    }

    console.error("Failed to delete student registration:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete registration.",
    });
  }
};




////count
// 6. COUNT
export const getStudentRegistrationCountController = async (
  _req: Request,
  res: Response<StudentRegistrationCountResponse>,
) => {
  try {
    const count = await getStudentRegistrationCount();

    res.status(200).json({
      success: true,
      data: {
        count,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch student registration count:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch student registration count.",
    });
  }
};