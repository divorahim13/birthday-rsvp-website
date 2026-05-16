import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { Lock, LogOut, UsersRound } from "lucide-react";

import { loginAdmin, logoutAdmin } from "@/app/admin/actions";
import { eventConfig } from "@/lib/event-config";
import { isAdminAuthenticated, isAdminPasswordConfigured } from "@/lib/admin-auth";
import { getRsvpStore, getStorageErrorMessage } from "@/lib/rsvp-store";
import type { Attendance, RsvpEntry } from "@/lib/rsvp-types";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type AdminPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

function getSummary(entries: RsvpEntry[]) {
  const byAttendance: Record<Attendance, number> = {
    yes: 0,
    no: 0,
    maybe: 0
  };

  for (const entry of entries) {
    byAttendance[entry.attendance] += 1;
  }

  const attendingTotal = entries
    .filter((entry) => entry.attendance === "yes")
    .reduce((total, entry) => total + entry.guestCount, 0);

  return {
    attendingTotal,
    byAttendance
  };
}

function StatusBadge({ status }: { status: Attendance }) {
  const label = status === "yes" ? "Yes" : status === "no" ? "No" : "Maybe";
  const className =
    status === "yes"
      ? "bg-[var(--color-celadon)] text-[var(--color-ink)]"
      : status === "no"
        ? "bg-[var(--color-danger-wash)] text-[var(--color-danger)]"
        : "bg-[var(--color-blush)] text-[var(--color-wine)]";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{label}</span>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--color-paper)] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-wine)]">Private guest log</p>
            <h1 className="mt-2 font-serif text-4xl text-[var(--color-ink)] sm:text-5xl">
              {eventConfig.eventTitle}
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--color-line)] bg-white px-5 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-wine)] hover:text-[var(--color-wine)]"
          >
            View site
          </Link>
        </div>
        {children}
      </div>
    </main>
  );
}

function LoginPanel({ error }: { error?: string }) {
  const message =
    error === "missing-admin-password"
      ? "Set ADMIN_PASSWORD before using the admin log."
      : error === "invalid-password"
        ? "That password did not match. Please try again."
        : null;

  return (
    <AdminShell>
      <section className="max-w-xl rounded-[2rem] border border-[var(--color-line)] bg-white p-6 shadow-[0_24px_80px_rgba(47,40,34,0.08)] sm:p-8">
        <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-[var(--color-ink)] text-white">
          <Lock className="size-5" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-3xl text-[var(--color-ink)]">Host access</h2>
        <p className="mt-3 text-base leading-7 text-[var(--color-muted)]">
          Enter the admin password to review RSVPs and guest counts.
        </p>

        {message ? (
          <p className="mt-5 rounded-2xl border border-[var(--color-danger-soft)] bg-[var(--color-danger-wash)] p-4 text-sm text-[var(--color-danger)]">
            {message}
          </p>
        ) : null}

        <form action={loginAdmin} className="mt-6 grid gap-4">
          <label className="text-sm font-semibold text-[var(--color-ink)]" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="min-h-12 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 text-base outline-none transition focus:border-[var(--color-wine)] focus:ring-2 focus:ring-[var(--color-wine-soft)]"
          />
          <button className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-ink)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-wine)]">
            Open guest log
          </button>
        </form>
      </section>
    </AdminShell>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--color-celadon)] text-[var(--color-ink)]">
        <UsersRound className="size-5" aria-hidden="true" />
      </div>
      <h2 className="font-serif text-3xl text-[var(--color-ink)]">No RSVPs yet.</h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[var(--color-muted)]">
        Once guests reply, their responses will appear here with timestamps and party counts.
      </p>
    </div>
  );
}

function Dashboard({ entries }: { entries: RsvpEntry[] }) {
  const summary = getSummary(entries);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <article className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_54px_rgba(47,40,34,0.06)]">
          <p className="text-sm text-[var(--color-muted)]">Attending guests</p>
          <p className="mt-2 text-4xl font-semibold text-[var(--color-ink)]">{summary.attendingTotal}</p>
        </article>
        <article className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-5">
          <p className="text-sm text-[var(--color-muted)]">Yes</p>
          <p className="mt-2 text-4xl font-semibold text-[var(--color-sage)]">{summary.byAttendance.yes}</p>
        </article>
        <article className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-5">
          <p className="text-sm text-[var(--color-muted)]">Maybe</p>
          <p className="mt-2 text-4xl font-semibold text-[var(--color-wine)]">{summary.byAttendance.maybe}</p>
        </article>
        <article className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-5">
          <p className="text-sm text-[var(--color-muted)]">No</p>
          <p className="mt-2 text-4xl font-semibold text-[var(--color-danger)]">{summary.byAttendance.no}</p>
        </article>
      </div>

      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-[var(--color-line)] bg-white shadow-[0_24px_80px_rgba(47,40,34,0.08)]">
          <div className="flex flex-col gap-4 border-b border-[var(--color-line)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-3xl text-[var(--color-ink)]">RSVP log</h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{entries.length} total responses</p>
            </div>
            <form action={logoutAdmin}>
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--color-line)] px-5 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-wine)] hover:text-[var(--color-wine)]">
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead className="bg-[var(--color-paper)] text-sm text-[var(--color-muted)]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Guest</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Party</th>
                  <th className="px-5 py-4 font-semibold">Contact</th>
                  <th className="px-5 py-4 font-semibold">Dietary</th>
                  <th className="px-5 py-4 font-semibold">Note</th>
                  <th className="px-5 py-4 font-semibold">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)] text-sm">
                {entries.map((entry) => (
                  <tr key={entry.id} className="align-top">
                    <td className="px-5 py-4 font-semibold text-[var(--color-ink)]">{entry.guestName}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={entry.attendance} />
                    </td>
                    <td className="px-5 py-4 text-[var(--color-muted)]">{entry.guestCount}</td>
                    <td className="px-5 py-4 text-[var(--color-muted)]">{entry.contact || "-"}</td>
                    <td className="px-5 py-4 text-[var(--color-muted)]">{entry.dietary || "-"}</td>
                    <td className="max-w-[16rem] px-5 py-4 text-[var(--color-muted)]">{entry.note || "-"}</td>
                    <td className="px-5 py-4 text-[var(--color-muted)]">{formatDateTime(entry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  noStore();

  const params = await searchParams;

  if (!isAdminPasswordConfigured() || !(await isAdminAuthenticated())) {
    return <LoginPanel error={params?.error} />;
  }

  let entries: RsvpEntry[] = [];
  let storageError: string | null = null;

  try {
    entries = await getRsvpStore().list();
  } catch (error) {
    storageError = getStorageErrorMessage(error);
  }

  if (storageError) {
    return (
      <AdminShell>
        <div className="rounded-[2rem] border border-[var(--color-danger-soft)] bg-[var(--color-danger-wash)] p-6 text-[var(--color-danger)]">
          {storageError}
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <Dashboard entries={entries} />
    </AdminShell>
  );
}
