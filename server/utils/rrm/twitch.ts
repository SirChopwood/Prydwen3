import url from "url"
import {TwitchChannel} from "~/server/schema/rrm/twitch";
import {z} from "zod";
import {RRM_TwitchChannel} from "~/server/database/schema";
import {useDrizzle} from "~/server/utils/drizzle";

// Returns a list of usernames and ids for channels the user has moderator permissions in.
export async function fetchModeratedChannels(channelId: string, token: string) {
    const userModsRequests = await fetch(url.format({
        protocol: "https",
        hostname: "api.twitch.tv",
        pathname: "/helix/moderation/channels",
        query: {
            user_id: channelId
        }
    }), {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Client-Id": process.env.NUXT_OAUTH_TWITCH_CLIENT_ID as string,
        }
    })
    if (userModsRequests.status === 200) {
        let modsData = await userModsRequests.json()
        let streamerList: Array<z.infer<typeof TwitchChannel>> = []
        for (let streamer of modsData.data) {
            streamerList.push({id: streamer.broadcaster_id, name: streamer.broadcaster_name})
        }
        return streamerList
    } else {
        return null
    }
}

export async function isChannelRegistered(channel: z.infer<typeof TwitchChannel>, blocking: boolean = false) {
    return !!(await fetchChannel(channel, blocking))
}

export async function fetchChannel(channel: z.infer<typeof TwitchChannel>, blocking: boolean = false) {
    let foundChannel: RRM_TwitchChannel | undefined
    try {
        foundChannel = await useDrizzle().query.RRM_TwitchChannel.findFirst({
            where: (channels, {eq, and}) => {
                return and(
                    eq(channels.id, channel.id),
                    eq(channels.name, channel.name)
                )
            },
            with: {
                ownedSessions: true
            }
        })
    } catch (error) {
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: `Channel '${channel.name}' could not be found.`})
        }
    }
    if (foundChannel) {
        return foundChannel
    } else {
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: `Channel '${channel.name}' is not registered.`})
        }
    }
}

export async function createChannel(channel: z.infer<typeof TwitchChannel>, colour: string, blocking: boolean = false) {
    try {
        await useDrizzle().insert(RRM_TwitchChannel).values({
            id: channel.id,
            name: channel.name
        })
        return await fetchChannel(channel)
    } catch (error) {
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: "Failed to add channel. (May already exist)"})
        }
    }
}