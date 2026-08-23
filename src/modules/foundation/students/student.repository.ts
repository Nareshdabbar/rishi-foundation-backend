import { query } from "../../../db/query.js";

import type { StudentRegistrationRequest } from "@rishi-foundation/contracts";

export const createStudentRegistration = async (
  input: StudentRegistrationRequest,
) => {
  const result = await query(
    `
      INSERT INTO foundation_student_registrations (
        registration_type,
        student_name,
        surname,
        date_of_birth,
        gender,
        teacher_name,
        teacher_phone,
        father_name,
        mother_name,
        guardian_name,
        parent_phone,
        alternate_phone,
        parent_email,
        state,
        district,
        mandal,
        village_town,
        pincode,
        school_name,
        school_type,
        current_class,
        academic_year,
        note
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20,
        $21, $22, $23
      )
      RETURNING
        id,
        registration_type AS "registrationType",
        student_name AS "studentName",
        surname,
        date_of_birth AS "dateOfBirth",
        gender,
        teacher_name AS "teacherName",
        teacher_phone AS "teacherPhone",
        father_name AS "fatherName",
        mother_name AS "motherName",
        guardian_name AS "guardianName",
        parent_phone AS "parentPhone",
        alternate_phone AS "alternatePhone",
        parent_email AS "parentEmail",
        state,
        district,
        mandal,
        village_town AS "villageTown",
        pincode,
        school_name AS "schoolName",
        school_type AS "schoolType",
        current_class AS "currentClass",
        academic_year AS "academicYear",
        note,
        created_at,
        updated_at;
    `,
    [
      input.registrationType,
      input.studentName,
      input.surname,
      input.dateOfBirth,
      input.gender,
      input.teacherName ?? null,
      input.teacherPhone ?? null,
      input.fatherName ?? null,
      input.motherName ?? null,
      input.guardianName ?? null,
      input.parentPhone ?? null,
      input.alternatePhone ?? null,
      input.parentEmail ?? null,
      input.state,
      input.district,
      input.mandal,
      input.villageTown,
      input.pincode,
      input.schoolName,
      input.schoolType,
      input.currentClass,
      input.academicYear,
      input.note ?? null,
    ],
  );

  return result.rows[0];
};

export const findAllStudentRegistrations = async () => {
  const result = await query(
    `
      SELECT
        id,
        registration_type AS "registrationType",
        student_name AS "studentName",
        surname,
        date_of_birth AS "dateOfBirth",
        gender,
        teacher_name AS "teacherName",
        teacher_phone AS "teacherPhone",
        father_name AS "fatherName",
        mother_name AS "motherName",
        guardian_name AS "guardianName",
        parent_phone AS "parentPhone",
        alternate_phone AS "alternatePhone",
        parent_email AS "parentEmail",
        state,
        district,
        mandal,
        village_town AS "villageTown",
        pincode,
        school_name AS "schoolName",
        school_type AS "schoolType",
        current_class AS "currentClass",
        academic_year AS "academicYear",
        note,
        created_at,
        updated_at
      FROM foundation_student_registrations
      ORDER BY created_at DESC;
    `,
  );

  return result.rows;
};

export const findStudentRegistrationById = async (id: string) => {
  const result = await query(
    `
      SELECT
        id,
        registration_type AS "registrationType",
        student_name AS "studentName",
        surname,
        date_of_birth AS "dateOfBirth",
        gender,
        teacher_name AS "teacherName",
        teacher_phone AS "teacherPhone",
        father_name AS "fatherName",
        mother_name AS "motherName",
        guardian_name AS "guardianName",
        parent_phone AS "parentPhone",
        alternate_phone AS "alternatePhone",
        parent_email AS "parentEmail",
        state,
        district,
        mandal,
        village_town AS "villageTown",
        pincode,
        school_name AS "schoolName",
        school_type AS "schoolType",
        current_class AS "currentClass",
        academic_year AS "academicYear",
        note,
        created_at,
        updated_at
      FROM foundation_student_registrations
      WHERE id = $1;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};

export const updateStudentRegistration = async (
  id: string,
  input: StudentRegistrationRequest,
) => {
  const result = await query(
    `
      UPDATE foundation_student_registrations
      SET
        registration_type = $1,
        student_name = $2,
        surname = $3,
        date_of_birth = $4,
        gender = $5,
        teacher_name = $6,
        teacher_phone = $7,
        father_name = $8,
        mother_name = $9,
        guardian_name = $10,
        parent_phone = $11,
        alternate_phone = $12,
        parent_email = $13,
        state = $14,
        district = $15,
        mandal = $16,
        village_town = $17,
        pincode = $18,
        school_name = $19,
        school_type = $20,
        current_class = $21,
        academic_year = $22,
        note = $23,
        updated_at = NOW()
      WHERE id = $24
      RETURNING
        id,
        registration_type AS "registrationType",
        student_name AS "studentName",
        surname,
        date_of_birth AS "dateOfBirth",
        gender,
        teacher_name AS "teacherName",
        teacher_phone AS "teacherPhone",
        father_name AS "fatherName",
        mother_name AS "motherName",
        guardian_name AS "guardianName",
        parent_phone AS "parentPhone",
        alternate_phone AS "alternatePhone",
        parent_email AS "parentEmail",
        state,
        district,
        mandal,
        village_town AS "villageTown",
        pincode,
        school_name AS "schoolName",
        school_type AS "schoolType",
        current_class AS "currentClass",
        academic_year AS "academicYear",
        note,
        created_at,
        updated_at;
    `,
    [
      input.registrationType,
      input.studentName,
      input.surname,
      input.dateOfBirth,
      input.gender,
      input.teacherName ?? null,
      input.teacherPhone ?? null,
      input.fatherName ?? null,
      input.motherName ?? null,
      input.guardianName ?? null,
      input.parentPhone ?? null,
      input.alternatePhone ?? null,
      input.parentEmail ?? null,
      input.state,
      input.district,
      input.mandal,
      input.villageTown,
      input.pincode,
      input.schoolName,
      input.schoolType,
      input.currentClass,
      input.academicYear,
      input.note ?? null,
      id,
    ],
  );

  return result.rows[0] ?? null;
};

export const deleteStudentRegistration = async (id: string) => {
  const result = await query(
    `
      DELETE FROM foundation_student_registrations
      WHERE id = $1
      RETURNING id;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};




export const countStudentRegistrations = async (): Promise<number> => {
  const result = await query<{ count: string }>(
    `
      SELECT COUNT(*)::text AS count
      FROM foundation_student_registrations;
    `,
  );

  return Number(result.rows[0]?.count ?? 0);
};