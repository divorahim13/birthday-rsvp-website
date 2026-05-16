"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";

import { submitRsvp } from "@/app/actions";
import type { Attendance, RsvpActionState } from "@/lib/rsvp-types";

const initialState: RsvpActionState = {
  status: "idle",
  message: ""
};

const attendanceOptions: Array<{ value: Attendance; label: string; helper: string }> = [
  { value: "yes", label: "Yes", helper: "Count me in" },
  { value: "maybe", label: "Maybe", helper: "I am checking" },
  { value: "no", label: "No", helper: "With regrets" }
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-wine)] focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
    >
      <Send className="size-4" aria-hidden="true" />
      {pending ? "Saving RSVP" : "Send RSVP"}
    </button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-sm text-[var(--color-danger)]">{errors[0]}</p>;
}

export function RsvpForm() {
  const [state, formAction] = useActionState(submitRsvp, initialState);
  const defaultAttendance = state.values?.attendance ?? "yes";

  if (state.status === "success") {
    return (
      <div className="rounded-[2rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_24px_80px_rgba(47,40,34,0.08)] sm:p-8">
        <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-[var(--color-sage)] text-white">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </div>
        <h3 className="font-serif text-3xl text-[var(--color-ink)]">You are on the list.</h3>
        <p className="mt-3 max-w-xl text-base leading-7 text-[var(--color-muted)]">{state.message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-line)] px-5 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-wine)] hover:text-[var(--color-wine)]"
        >
          Add another response
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-[2rem] border border-[var(--color-line)] bg-white p-5 shadow-[0_24px_80px_rgba(47,40,34,0.08)] sm:p-8"
      noValidate
    >
      <div className="mb-7">
        <p className="text-sm font-semibold text-[var(--color-wine)]">RSVP</p>
        <h2 className="mt-2 font-serif text-3xl text-[var(--color-ink)] sm:text-4xl">Let us know what to set aside.</h2>
        <p className="mt-3 max-w-xl text-base leading-7 text-[var(--color-muted)]">
          A quick reply keeps dinner, seating, and weekend details easy for everyone.
        </p>
      </div>

      {state.status === "error" ? (
        <div className="mb-6 flex gap-3 rounded-2xl border border-[var(--color-danger-soft)] bg-[var(--color-danger-wash)] p-4 text-sm text-[var(--color-danger)]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{state.message}</p>
        </div>
      ) : null}

      <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5">
        <div>
          <label className="text-sm font-semibold text-[var(--color-ink)]" htmlFor="guestName">
            Guest name
          </label>
          <input
            id="guestName"
            name="guestName"
            type="text"
            defaultValue={state.values?.guestName ?? ""}
            autoComplete="name"
            className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 text-base outline-none transition focus:border-[var(--color-wine)] focus:ring-2 focus:ring-[var(--color-wine-soft)]"
            placeholder="Your name"
          />
          <FieldError errors={state.fieldErrors?.guestName} />
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-[var(--color-ink)]">Will you be there?</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {attendanceOptions.map((option) => (
              <label
                key={option.value}
                className="group relative min-h-24 cursor-pointer rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-4 transition has-[:checked]:border-[var(--color-wine)] has-[:checked]:bg-[var(--color-blush)]"
              >
                <input
                  type="radio"
                  name="attendance"
                  value={option.value}
                  defaultChecked={defaultAttendance === option.value}
                  className="sr-only"
                />
                <span className="block text-lg font-semibold text-[var(--color-ink)]">{option.label}</span>
                <span className="mt-1 block text-sm text-[var(--color-muted)]">{option.helper}</span>
              </label>
            ))}
          </div>
          <FieldError errors={state.fieldErrors?.attendance} />
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-[0.8fr_1.2fr]">
          <div>
            <label className="text-sm font-semibold text-[var(--color-ink)]" htmlFor="guestCount">
              Party size
            </label>
            <input
              id="guestCount"
              name="guestCount"
              type="number"
              min="0"
              max="8"
              defaultValue={state.values?.guestCount ?? 1}
              className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 text-base outline-none transition focus:border-[var(--color-wine)] focus:ring-2 focus:ring-[var(--color-wine-soft)]"
            />
            <FieldError errors={state.fieldErrors?.guestCount} />
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-ink)]" htmlFor="contact">
              Contact, optional
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              defaultValue={state.values?.contact ?? ""}
              autoComplete="email"
              className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 text-base outline-none transition focus:border-[var(--color-wine)] focus:ring-2 focus:ring-[var(--color-wine-soft)]"
              placeholder="Email or phone"
            />
            <FieldError errors={state.fieldErrors?.contact} />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--color-ink)]" htmlFor="dietary">
            Dietary preference, optional
          </label>
          <input
            id="dietary"
            name="dietary"
            type="text"
            defaultValue={state.values?.dietary ?? ""}
            className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 text-base outline-none transition focus:border-[var(--color-wine)] focus:ring-2 focus:ring-[var(--color-wine-soft)]"
            placeholder="Vegetarian, allergies, or anything helpful"
          />
          <FieldError errors={state.fieldErrors?.dietary} />
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--color-ink)]" htmlFor="note">
            Note, optional
          </label>
          <textarea
            id="note"
            name="note"
            defaultValue={state.values?.note ?? ""}
            rows={4}
            className="mt-2 w-full resize-y rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3 text-base outline-none transition focus:border-[var(--color-wine)] focus:ring-2 focus:ring-[var(--color-wine-soft)]"
            placeholder="A song request, travel note, or quick hello"
          />
          <FieldError errors={state.fieldErrors?.note} />
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Responses are saved privately for the host and shown only in the admin log.
          </p>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
