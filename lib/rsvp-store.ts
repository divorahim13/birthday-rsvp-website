import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import postgres from "postgres";

import type { Attendance, RsvpEntry, RsvpInput } from "@/lib/rsvp-types";

type RsvpStore = {
  create(input: RsvpInput): Promise<RsvpEntry>;
  list(): Promise<RsvpEntry[]>;
};

type RsvpRow = {
  id: string;
  guest_name: string;
  attendance: Attendance;
  guest_count: number;
  contact: string | null;
  note: string | null;
  dietary: string | null;
  created_at: string | Date;
};

let sqlClient: postgres.Sql | undefined;
let schemaReady: Promise<void> | undefined;

export class StorageConfigurationError extends Error {
  constructor() {
    super("DATABASE_URL is required for production RSVP persistence.");
    this.name = "StorageConfigurationError";
  }
}

function isProduction() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}

function getDatabaseUrl() {
  return process.env.DATABASE_URL;
}

export function hasProductionRsvpStorage() {
  return Boolean(getDatabaseUrl());
}

function getSqlClient() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new StorageConfigurationError();
  }

  if (!sqlClient) {
    const isLocalDatabase =
      databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");

    sqlClient = postgres(databaseUrl, {
      max: 1,
      prepare: false,
      ssl: isLocalDatabase ? false : "require"
    });
  }

  return sqlClient;
}

async function ensureSchema() {
  const sql = getSqlClient();

  schemaReady ??= sql`
    create table if not exists rsvp_entries (
      id text primary key,
      guest_name text not null,
      attendance text not null check (attendance in ('yes', 'no', 'maybe')),
      guest_count integer not null check (guest_count >= 0),
      contact text,
      note text,
      dietary text,
      created_at timestamptz not null
    )
  `.then(() => undefined);

  await schemaReady;
}

function rowToEntry(row: RsvpRow): RsvpEntry {
  return {
    id: row.id,
    guestName: row.guest_name,
    attendance: row.attendance,
    guestCount: row.guest_count,
    contact: row.contact ?? undefined,
    note: row.note ?? undefined,
    dietary: row.dietary ?? undefined,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString()
  };
}

function createPostgresStore(): RsvpStore {
  return {
    async create(input) {
      await ensureSchema();

      const sql = getSqlClient();
      const entry: RsvpEntry = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };

      await sql`
        insert into rsvp_entries (
          id,
          guest_name,
          attendance,
          guest_count,
          contact,
          note,
          dietary,
          created_at
        )
        values (
          ${entry.id},
          ${entry.guestName},
          ${entry.attendance},
          ${entry.guestCount},
          ${entry.contact ?? null},
          ${entry.note ?? null},
          ${entry.dietary ?? null},
          ${entry.createdAt}
        )
      `;

      return entry;
    },
    async list() {
      await ensureSchema();

      const sql = getSqlClient();
      const rows = await sql<RsvpRow[]>`
        select
          id,
          guest_name,
          attendance,
          guest_count,
          contact,
          note,
          dietary,
          created_at
        from rsvp_entries
        order by created_at desc
      `;

      return rows.map(rowToEntry);
    }
  };
}

function createLocalStore(): RsvpStore {
  const filePath = path.join(process.cwd(), ".data", "rsvps.json");

  async function readEntries() {
    try {
      const file = await fs.readFile(filePath, "utf8");
      return JSON.parse(file) as RsvpEntry[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }

      throw error;
    }
  }

  async function writeEntries(entries: RsvpEntry[]) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(entries, null, 2));
  }

  return {
    async create(input) {
      const entries = await readEntries();
      const entry: RsvpEntry = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };

      entries.unshift(entry);
      await writeEntries(entries);

      return entry;
    },
    async list() {
      return readEntries();
    }
  };
}

export function getRsvpStore(): RsvpStore {
  if (getDatabaseUrl()) {
    return createPostgresStore();
  }

  if (isProduction()) {
    throw new StorageConfigurationError();
  }

  return createLocalStore();
}

export function getStorageErrorMessage(error: unknown) {
  if (error instanceof StorageConfigurationError) {
    return "RSVP storage is not configured for production. Set DATABASE_URL to a Postgres-compatible database before accepting live responses.";
  }

  return "RSVP storage is temporarily unavailable. Please try again shortly.";
}
