import {
  createEnquiry,
  deleteEnquiry,
  findAllEnquiries,
  findEnquiryById,
  updateEnquiryStatus,
} from "./enquiry.repository.js";

import type {
  CreateEnquiryRequest,
  UpdateEnquiryRequest,
} from "@rishi-foundation/contracts";

export const createNewEnquiry = async (
  input: CreateEnquiryRequest,
) => {
  return createEnquiry(input);
};

export const getAllEnquiries = async () => {
  return findAllEnquiries();
};

export const getEnquiryById = async (
  id: string,
) => {
  const enquiry = await findEnquiryById(id);

  if (!enquiry) {
    throw new Error("ENQUIRY_NOT_FOUND");
  }

  return enquiry;
};

export const updateExistingEnquiry =
  async (
    id: string,
    input: UpdateEnquiryRequest,
  ) => {
    const existingEnquiry =
      await findEnquiryById(id);

    if (!existingEnquiry) {
      throw new Error("ENQUIRY_NOT_FOUND");
    }

    const updatedEnquiry =
      await updateEnquiryStatus(
        id,
        input,
      );

    if (!updatedEnquiry) {
      throw new Error("ENQUIRY_NOT_FOUND");
    }

    return updatedEnquiry;
  };

export const deleteExistingEnquiry =
  async (id: string) => {
    const enquiry =
      await deleteEnquiry(id);

    if (!enquiry) {
      throw new Error("ENQUIRY_NOT_FOUND");
    }

    return enquiry;
  };
