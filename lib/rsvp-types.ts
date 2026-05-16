export type Attendance = "yes" | "no" | "maybe";

export type RsvpEntry = {
  id: string;
  guestName: string;
  attendance: Attendance;
  guestCount: number;
  contact?: string;
  note?: string;
  dietary?: string;
  createdAt: string;
};

export type RsvpInput = Omit<RsvpEntry, "id" | "createdAt">;

export type RsvpFieldErrors = Partial<Record<keyof RsvpInput | "company", string[]>>;

export type RsvpActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: RsvpFieldErrors;
  values?: Partial<RsvpInput>;
};
