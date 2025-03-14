import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

// Main tables
export const RRM_Session = sqliteTable("RRM_Session", {
    id: integer("id")
        .primaryKey({ autoIncrement: true }),

    requests: text("requests", {mode: "json"})
        .$type<Array<number>>()
        .default([]) // Array of RRM_Request ids
        .notNull(),

    status: text("status", {enum: ["Open", "Locked", "Closed"]})
        .default("Locked")
        .notNull(),

    startTime: text("start_time")
        .notNull(),

    endTime: text("end_time"),

    lastUser: text("last_user")
        .notNull(),

    owner: text("owner", {mode: "json"})
        .$type<{name: String, id: Number}>()
        .notNull(),

    channels: text("channels", {mode: "json"})
        .$type<Array<{name: String, id: Number}>>()
        .default([]),
});

export const RRM_Request = sqliteTable("RRM_Request", {
    id: integer("id")
        .primaryKey({ autoIncrement: true }),

    sessionId: integer()
        .notNull(),

    timestamp: text("timestamp")
        .notNull(),

    text: text("text")
        .notNull(),

    user: text("user")
        .notNull(),

    code: text("code")
        .notNull(),

    metadata: text("metadata", {mode: "json"})
        .notNull(),
});