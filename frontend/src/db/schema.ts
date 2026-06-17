import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  real,
  jsonb,
  vector,
  index,
} from "drizzle-orm/pg-core";

// Until Clerk is wired, everything lives in a single default workspace.
export const DEFAULT_WORKSPACE = "default";

// ── Product: knowledge documents + retrievable chunks ───────────────────────
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: text("workspace_id").notNull().default(DEFAULT_WORKSPACE),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  source: text("source").notNull().default("manual"), // manual | import | github | slack
  sourceRef: text("source_ref"),
  createdBy: text("created_by"),
  tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  // Trust / freshness
  verifiedAt: timestamp("verified_at"),
  verifiedBy: text("verified_by"),
  freshnessState: text("freshness_state").notNull().default("unverified"), // verified | stale | unverified
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chunks = pgTable(
  "chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id").notNull().default(DEFAULT_WORKSPACE),
    idx: integer("idx").notNull().default(0),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }), // null until OPENAI key present
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({ docIdx: index("chunks_document_id_idx").on(t.documentId) }),
);

// ── Product: Q&A log + citations + trust audit + gaps ───────────────────────
export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: text("workspace_id").notNull().default(DEFAULT_WORKSPACE),
  text: text("text").notNull(),
  answered: boolean("answered").notNull().default(false),
  answer: text("answer"),
  confidence: real("confidence"), // 0..1
  provider: text("provider"),
  numSources: integer("num_sources").notNull().default(0),
  askedBy: text("asked_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const answerSources = pgTable("answer_sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  documentId: uuid("document_id").references(() => documents.id, { onDelete: "set null" }),
  title: text("title"),
  score: real("score"),
});

export const verifications = pgTable("verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  action: text("action").notNull(), // verified | flagged_stale
  note: text("note"),
  actor: text("actor"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const knowledgeGaps = pgTable("knowledge_gaps", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: text("workspace_id").notNull().default(DEFAULT_WORKSPACE),
  query: text("query").notNull(),
  occurrences: integer("occurrences").notNull().default(1),
  status: text("status").notNull().default("open"), // open | resolved
  lastSeen: timestamp("last_seen").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Build self-tracking (roadmap / progress / metrics live IN the DB) ────────
export const roadmap = pgTable("roadmap", {
  id: uuid("id").primaryKey().defaultRandom(),
  itemKey: text("item_key").notNull().unique(),
  phase: text("phase").notNull(),
  title: text("title").notNull(),
  complexity: integer("complexity").notNull().default(0), // 0 | 1 | 2
  status: text("status").notNull().default("planned"), // planned | in_progress | done | deferred
  notes: text("notes"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const buildProgress = pgTable("build_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  itemKey: text("item_key"),
  event: text("event").notNull(),
  detail: text("detail"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const metrics = pgTable("metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  value: real("value"),
  meta: jsonb("meta"),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
});
