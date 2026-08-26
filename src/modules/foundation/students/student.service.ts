import {
  countStudentRegistrations,
  createStudentRegistration,
  deleteStudentRegistration,
  findAllStudentRegistrations,
  findStudentRegistrationById,
  updateStudentRegistration,
} from "./student.repository.js";

import type {
  StudentRegistration,
  StudentRegistrationRequest,
} from "@rishi-foundation/contracts";

export const createNewStudentRegistration = async (
  input: StudentRegistrationRequest,
): Promise<StudentRegistration> => {
  return createStudentRegistration(input);
};

export const getAllStudentRegistrations = async (): Promise<
  StudentRegistration[]
> => {
  return findAllStudentRegistrations();
};

export const getStudentRegistrationById = async (
  id: string,
): Promise<StudentRegistration> => {
  const registration = await findStudentRegistrationById(id);

  if (!registration) {
    throw new Error("STUDENT_REGISTRATION_NOT_FOUND");
  }

  return registration;
};

export const updateExistingStudentRegistration = async (
  id: string,
  input: StudentRegistrationRequest,
): Promise<StudentRegistration> => {
  const existingRegistration = await findStudentRegistrationById(id);

  if (!existingRegistration) {
    throw new Error("STUDENT_REGISTRATION_NOT_FOUND");
  }

  const updatedRegistration = await updateStudentRegistration(id, input);

  if (!updatedRegistration) {
    throw new Error("STUDENT_REGISTRATION_NOT_FOUND");
  }

  return updatedRegistration;
};

export const deleteExistingStudentRegistration = async (
  id: string,
): Promise<{ id: string }> => {
  const registration = await deleteStudentRegistration(id);

  if (!registration) {
    throw new Error("STUDENT_REGISTRATION_NOT_FOUND");
  }

  return registration;
};

export const getStudentRegistrationCount = async (): Promise<number> => {
  return countStudentRegistrations();
};
