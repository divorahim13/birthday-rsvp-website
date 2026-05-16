import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { eventConfig } from "@/lib/event-config";

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center bg-[var(--color-paper)] px-5 py-12 sm:px-8">
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_24px_80px_rgba(47,40,34,0.08)] sm:p-10">
        <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-[var(--color-sage)] text-white">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-[var(--color-wine)]">RSVP received</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-[var(--color-ink)]">
          Thank you for replying to {eventConfig.eventTitle}.
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--color-muted)]">
          The host has your response. If plans shift, send another RSVP with the updated details.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-ink)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--color-wine)]"
        >
          Back to invitation
        </Link>
      </section>
    </main>
  );
}
