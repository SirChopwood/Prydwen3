import { drizzle } from 'drizzle-orm/d1'
export { sql, eq, and, or } from 'drizzle-orm'

import * as schema from '../database/schema'

export const tables = schema

export function useDrizzle() {
    return drizzle(hubDatabase(), { schema })
}

export type RRM_Session = typeof schema.RRM_Session.$inferSelect
export type RRM_Request = typeof schema.RRM_Request.$inferSelect
export type RRM_TwitchChannel = typeof schema.RRM_TwitchChannel.$inferSelect
export type RRM_SessionToChannels = typeof schema.RRM_SessionToChannels.$inferSelect