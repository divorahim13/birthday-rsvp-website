"use server";

import { rsvpFormSchema } from "@/lib/rsvp-schema";
import { getRsvpStore, getStorageErrorMessage } from "@/lib/rsvp-store";
import type { RsvpActionState, RsvpFieldErrors, RsvpInput } from "@/lib/rsvp-types";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function toFieldErrors(error: ReturnType<typeof rsvpFormSchema.safeParse>) {
  if (error.success) {
    return undefined;
  }

  return error.error.flatten().fieldErrors as RsvpFieldErrors;
}

export async function submitRsvp(
  _previousState: RsvpActionState,
  formData: FormData
): Promise<RsvpActionState> {
  const raw = {
    guestName: readString(formData, "guestName"),
    attendance: readString(formData, "attendance"),
    guestCount: readString(formData, "guestCount"),
    contact: readString(formData, "contact"),
    note: readString(formData, "note"),
    dietary: readString(formData, "dietary"),
    company: readString(formData, "company")
  };

  const parsed = rsvpFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "A few details need attention before this RSVP can be saved.",
      fieldErrors: toFieldErrors(parsed),
      values: {
        guestName: raw.guestName,
        attendance: raw.attendance as RsvpInput["attendance"],
        guestCount: Number(raw.guestCount) || 0,
        contact: raw.contact,
        note: raw.note,
        dietary: raw.dietary
      }
    };
  }

  if (parsed.data.company) {
    return {
      status: "success",
      message: "Thank you. Your RSVP has been received."
    };
  }

  const input: RsvpInput = {
    guestName: parsed.data.guestName,
    attendance: parsed.data.attendance,
    guestCount: parsed.data.guestCount,
    contact: parsed.data.contact,
    note: parsed.data.note,
    dietary: parsed.data.dietary
  };

  try {
    await getRsvpStore().create(input);

    return {
      status: "success",
      message: "Thank you. Your RSVP is saved, and the host will see it in the guest log."
    };
  } catch (error) {
    return {
      status: "error",
      message: getStorageErrorMessage(error),
      values: input
    };
  }
}
