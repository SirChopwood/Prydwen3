import {z} from "zod"
import {TwitchChannel} from "~/server/schema/rrm/twitch";

export const createSession = z.strictObject({
    "user": z.string(),
    "owner": TwitchChannel,
    "channels": z.array(TwitchChannel),
    "sources": z.array(z.enum(["PyPy", "YouTube", "PlainText"])).min(1),
})

export const fetchSession = z.strictObject({
    "channel": TwitchChannel.optional(),
    "channels": z.array(TwitchChannel).optional(),
    "force": z.boolean().optional(),
    "sessionId": z.number().optional(),
})

export const setSession = z.strictObject({
    "sessionId": z.number().nullable(),
})

export const setPosition = z.strictObject({
    "user": z.string(),
    "sessionId": z.number(),
    "newPosition": z.number().min(0)
})

export const setStatus = z.strictObject({
    "user": z.string(),
    "sessionId": z.number(),
    "status": z.enum(["Open", "Locked", "Closed"])
})