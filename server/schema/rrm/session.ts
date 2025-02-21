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