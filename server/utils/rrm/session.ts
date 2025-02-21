import {TwitchChannel} from "~/server/schema/rrm/twitch";
import {z} from "zod"
import {useDrizzle} from "../drizzle";

export async function isChannelRegistered(channel: z.infer<typeof TwitchChannel>, silent: boolean = false) {
    return !!(await getChannel(channel, silent))
}

export async function getChannel(channel: z.infer<typeof TwitchChannel>, silent: boolean = false) {
    let foundChannel = await useDrizzle().query.RRM_TwitchChannel.findFirst({
        where: (channels, {eq, and}) => {
            return and(
                eq(channels.id, Number(channel.id)),
                eq(channels.name, channel.name)
            )
        },
        with: {
            ownedSessions: true
        }
    })
    if (foundChannel) {
        return foundChannel
    } else if (!silent) {
        throw createError({statusCode: 400, statusMessage: `Channel '${channel.name}' not registered.`})
    } else {
        return
    }
}