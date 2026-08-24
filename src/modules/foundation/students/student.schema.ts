import { z } from "zod";

const indianPhoneSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^[6-9]\d{9}$/.test(value),
    "Please enter a valid 10-digit Indian mobile number.",
  );

export const createStudentRegistrationSchema = z
  .object({
    registrationType: z.enum(["student", "teacher"], {
      message: "Please select student or teacher.",
    }),

    studentName: z
      .string()
      .trim()
      .min(1, "Student name is required.")
      .max(150, "Student name is too long."),

    surname: z
      .string()
      .trim()
      .min(1, "Surname is required.")
      .max(150, "Surname is too long."),

    dateOfBirth: z.string().trim().min(1, "Date of birth is required."),

    gender: z.string().trim().min(1, "Gender is required."),

    teacherName: z
      .string()
      .trim()
      .max(150, "Teacher name is too long.")
      .optional(),

    teacherPhone: indianPhoneSchema.optional(),

    fatherName: z
      .string()
      .trim()
      .max(150, "Father name is too long.")
      .optional(),

    motherName: z
      .string()
      .trim()
      .max(150, "Mother name is too long.")
      .optional(),

    guardianName: z
      .string()
      .trim()
      .max(150, "Guardian name is too long.")
      .optional(),

    parentPhone: indianPhoneSchema.optional(),

    alternatePhone: indianPhoneSchema.optional(),

    parentEmail: z
      .string()
      .trim()
      .max(255, "Email address is too long.")
      .refine(
        (value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        "Please enter a valid email address.",
      )
      .transform((value) => (value === "" ? undefined : value.toLowerCase()))
      .optional(),

    state: z.string().trim().min(1, "State is required."),

    district: z.string().trim().min(1, "District is required."),

    mandal: z.string().trim().min(1, "Mandal is required."),

    villageTown: z
      .string()
      .trim()
      .min(1, "Village / Town is required.")
      .max(150, "Village / Town is too long."),

    pincode: z
      .string()
      .trim()
      .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit pincode."),

    schoolName: z
      .string()
      .trim()
      .min(1, "School name is required.")
      .max(255, "School name is too long."),

    schoolType: z.string().trim().min(1, "School type is required."),

    currentClass: z.string().trim().min(1, "Current class is required."),

    academicYear: z.string().trim().min(1, "Academic year is required."),

    note: z.string().trim().max(2000, "Note is too long.").optional(),
  })
  .superRefine((data, ctx) => {
    /*
     * Teacher registration:
     * teacher name + teacher phone are required.
     */
    if (data.registrationType === "teacher") {
      if (!data.teacherName) {
        ctx.addIssue({
          code: "custom",
          path: ["teacherName"],
          message: "Teacher name is required.",
        });
      }

      if (!data.teacherPhone) {
        ctx.addIssue({
          code: "custom",
          path: ["teacherPhone"],
          message: "Teacher phone number is required.",
        });
      }
    }

    /*
     * At least one contact number is required.
     *
     * For student registration this can be:
     * - parentPhone
     * - alternatePhone
     *
     * Teacher registration has teacherPhone as its
     * required contact number.
     */
    if (
      data.registrationType === "student" &&
      !data.parentPhone &&
      !data.alternatePhone
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["parentPhone"],
        message: "At least one contact phone number is required.",
      });
    }
  });

export const updateStudentRegistrationSchema = createStudentRegistrationSchema;
