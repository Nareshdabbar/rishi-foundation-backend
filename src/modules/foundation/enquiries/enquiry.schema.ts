import { z } from "zod";

import { enquirySubjects, enquiryStatuses } from "@rishi-foundation/contracts";

export const createEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .max(150, "Full name is too long."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(255, "Email address is too long.")
    .transform((value) => value.toLowerCase()),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number."),

  subject: z.enum(enquirySubjects, {
    message: "Please select a valid enquiry subject.",
  }),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message is too long."),
});

export const updateEnquirySchema = z.object({
  status: z.enum(enquiryStatuses, {
    message: "Please select a valid enquiry status.",
  }),
});
