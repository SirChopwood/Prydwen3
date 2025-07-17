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

    sources: text("sources", {mode: "json"})
        .$type<Array<String>>()
        .default(["PlainText"])
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
        .default([])
        .notNull(),
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

export const ModCorp_Team = sqliteTable("ModCorp_Team", {
    id: integer("id")
        .primaryKey({ autoIncrement: true }),

    name: text("name")
        .notNull(),

    description: text("description")
        .notNull()
        .default(""),

    colour: text("colour")
        .notNull()
        .default("#ffbb00"),

    logo_url: text("logo_url")
        .notNull()
        .default(""),

    score: integer()
        .notNull()
        .default(0),

    discord: text("discord", {mode: "json"})
        .$type<{role: String, channel: String, server: String}>()
        .notNull()
        .default({'role': '', 'channel': '', 'server': ''}),
})

export const ModCorp_Logs = sqliteTable("ModCorp_Logs", {
    id: integer("id")
        .primaryKey({ autoIncrement: true }),

    user_name: text("user_name")
        .notNull(),

    user_id: text("user_id")
        .notNull(),

    action: text("action")
        .notNull(),

    reason: text("reason"),

    timestamp: text("timestamp")
        .notNull(),
})