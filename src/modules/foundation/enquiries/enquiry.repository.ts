import { query } from "../../../db/query.js";

import type {
  CreateEnquiryRequest,
  Enquiry,
  UpdateEnquiryRequest,
} from "@rishi-foundation/contracts";

export const createEnquiry = async (
  input: CreateEnquiryRequest,
): Promise<Enquiry> => {
  const result = await query<Enquiry>(
    `
      INSERT INTO foundation_enquiries (
        name,
        email,
        phone,
        subject,
        message
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        name,
        email,
        phone,
        subject,
        message,
        status,
        created_at,
        updated_at;
    `,
    [input.name, input.email, input.phone, input.subject, input.message],
  );

  return result.rows[0];
};

export const findAllEnquiries = async (): Promise<Enquiry[]> => {
  const result = await query<Enquiry>(
    `
        SELECT
          id,
          name,
          email,
          phone,
          subject,
          message,
          status,
          created_at,
          updated_at
        FROM foundation_enquiries
        ORDER BY created_at DESC;
      `,
  );

  return result.rows;
};

export const findEnquiryById = async (id: string): Promise<Enquiry | null> => {
  const result = await query<Enquiry>(
    `
      SELECT
        id,
        name,
        email,
        phone,
        subject,
        message,
        status,
        created_at,
        updated_at
      FROM foundation_enquiries
      WHERE id = $1;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};

export const updateEnquiryStatus = async (
  id: string,
  input: UpdateEnquiryRequest,
): Promise<Enquiry | null> => {
  const result = await query<Enquiry>(
    `
      UPDATE foundation_enquiries
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING
        id,
        name,
        email,
        phone,
        subject,
        message,
        status,
        created_at,
        updated_at;
    `,
    [input.status, id],
  );

  return result.rows[0] ?? null;
};

export const deleteEnquiry = async (id: string): Promise<Enquiry | null> => {
  const result = await query<Enquiry>(
    `
      DELETE FROM foundation_enquiries
      WHERE id = $1
      RETURNING
        id,
        name,
        email,
        phone,
        subject,
        message,
        status,
        created_at,
        updated_at;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};
