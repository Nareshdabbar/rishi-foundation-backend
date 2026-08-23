import {
  countStudentRegistrations,
  createStudentRegistration,
  deleteStudentRegistration,
  findAllStudentRegistrations,
  findStudentRegistrationById,
  updateStudentRegistration,
} from "./student.repository.js";

import type { StudentRegistrationRequest } from "@rishi-foundation/contracts";

export const createNewStudentRegistration = async (
  input: StudentRegistrationRequest,
) => {
  return createStudentRegistration(input);
};

export const getAllStudentRegistrations = async () => {
  return findAllStudentRegistrations();
};

export const getStudentRegistrationById = async (id: string) => {
  const registration = await findStudentRegistrationById(id);

  if (!registration) {
    throw new Error("STUDENT_REGISTRATION_NOT_FOUND");
  }

  return registration;
};

export const updateExistingStudentRegistration = async (
  id: string,
  input: StudentRegistrationRequest,
) => {
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

export const deleteExistingStudentRegistration = async (id: string) => {
  const registration = await deleteStudentRegistration(id);

  if (!registration) {
    throw new Error("STUDENT_REGISTRATION_NOT_FOUND");
  }

  return registration;
};


export const getStudentRegistrationCount = async (): Promise<number> => {
  return countStudentRegistrations();
};