import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

// Main tables
export const RRM_TwitchChannel = sqliteTable("RRM_TwitchChannel", {
    id: integer("id").primaryKey(),
    name: text("channel_name").notNull(),
    colour: text("channel_colour").default("#FFFFFF"),
    image: text("channel_image"),
});

export const RRM_Session = sqliteTable("RRM_Session", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    requests: text("requests").default("[]"),
    status: text("status").default("Locked"),
    startTime: text("start_time").notNull(),
    endTime: text("end_time"),
    lastUser: text("last_user").notNull(),
    ownerId: integer("owner_id").references(() => RRM_TwitchChannel.id),
});

export const RRM_Request = sqliteTable("RRM_Request", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    sessionId: integer("session_id").references(() => RRM_Session.id),
    text: text("text").notNull(),
    user: text("user").notNull(),
    code: text("code").notNull(),
    metadata: text("metadata").notNull(),
});

// Junction table for many-to-many relationship between sessions and channels
export const sessionToChannels = sqliteTable('session_to_channels', {
    sessionId: integer('session_id')
        .notNull()
        .references(() => RRM_Session.id),
    channelId: integer('channel_id')
        .notNull()
        .references(() => RRM_TwitchChannel.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.sessionId, t.channelId] })
}));

// Relations definitions
export const twitchChannelRelations = relations(RRM_TwitchChannel, ({ many }) => ({
    ownedSessions: many(RRM_Session),
    sessionToChannels: many(sessionToChannels)
}));

export const sessionRelations = relations(RRM_Session, ({ one, many }) => ({
    owner: one(RRM_TwitchChannel, {
        fields: [RRM_Session.ownerId],
        references: [RRM_TwitchChannel.id],
    }),
    requests: many(RRM_Request),
    sessionToChannels: many(sessionToChannels)
}));

export const requestRelations = relations(RRM_Request, ({ one }) => ({
    session: one(RRM_Session, {
        fields: [RRM_Request.sessionId],
        references: [RRM_Session.id],
    })
}));

export const sessionToChannelsRelations = relations(sessionToChannels, ({ one }) => ({
    session: one(RRM_Session, {
        fields: [sessionToChannels.sessionId],
        references: [RRM_Session.id],
    }),
    channel: one(RRM_TwitchChannel, {
        fields: [sessionToChannels.channelId],
        references: [RRM_TwitchChannel.id],
    }),
}));