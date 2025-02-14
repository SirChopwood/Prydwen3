import {z} from "zod"
import {TwitchChannel} from "~/server/schema/rrm/twitch";

export const createSession = z.strictObject({
    "user": z.string(),
    "owner": TwitchChannel,
    "channels": z.array(TwitchChannel)
})

export const fetchSession = z.strictObject({
    "channel": TwitchChannel.optional(),
})

export const createRequest = z.strictObject({
    "user": z.string(),
    "request": z.string(),
    "session": z.number(),
    "forceAdd": z.boolean().optional(),
})

export const fetchRequests = z.strictObject({
    "session": z.number(),
})