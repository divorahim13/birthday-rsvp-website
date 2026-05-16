import { z } from "zod";

const optionalText = (maxLength: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return undefined;
      }

      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(maxLength).optional()
  );

export const rsvpFormSchema = z
  .object({
    guestName: z
      .string()
      .trim()
      .min(2, "Please enter the guest name.")
      .max(80, "Please keep the name under 80 characters."),
    attendance: z.enum(["yes", "no", "maybe"], {
      error: "Please choose an RSVP status."
    }),
    guestCount: z.coerce
      .number()
      .int("Please enter a whole number.")
      .min(0, "Guest count cannot be negative.")
      .max(8, "Please contact the host for parties larger than 8."),
    contact: optionalText(120),
    note: optionalText(500),
    dietary: optionalText(240),
    company: optionalText(120)
  })
  .superRefine((value, context) => {
    if (value.attendance !== "no" && value.guestCount < 1) {
      context.addIssue({
        code: "custom",
        path: ["guestCount"],
        message: "Please include at least one guest if you may attend."
      });
    }
  });

export type RsvpFormValues = z.infer<typeof rsvpFormSchema>;
