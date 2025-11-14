import url from "url"
import {TwitchChannel} from "~/server/schema/rrm/twitch";
import {z} from "zod";
import {methods} from "netlify";
import {RRM_Group, tables, useDrizzle} from "~/server/utils/drizzle";


export async function fetchPermittedChannels(channelId: number, channelName: string, token: string) {
    let channelList: Array<z.infer<typeof TwitchChannel>> = []

    let modChannels = await fetchModeratedChannels(channelId, channelName, token)
    if (modChannels.length !== 0) {channelList = channelList.concat(modChannels)}

    let groupChannels = await fetchGroupChannels(channelId, channelName)
    if (groupChannels.length !== 0) {channelList = channelList.concat(groupChannels)}

    return channelList
}

export async function fetchGroupChannels(channelId: number, channelName: string) {
    let channelList: Array<z.infer<typeof TwitchChannel>> = []
    let channel = {id: channelId, name: channelName}
    let groups: Array<RRM_Group> | undefined
    groups = await useDrizzle().select().from(tables.RRM_Group).where(
        sql`(SELECT 1 FROM json_each(channels) WHERE (value = json(${JSON.stringify(channel)})))`, // Iterate through channels to see if one matches
    )
    if (groups && groups.length > 0) {
        for (let group of groups) {
            let channels = group.channels as Array<z.infer<typeof TwitchChannel>>
            for (let channel of channels) {
                if (!channelList.includes(channel)) {
                    channelList.push(channel)
                }
            }
        }
    }
    return channelList
}

// Returns a list of usernames and ids for channels the user has moderator permissions in.
export async function fetchModeratedChannels(channelId: number, channelName: string, token: string) {
    const userModsRequests = await fetch(url.format({
        protocol: "https",
        hostname: "api.twitch.tv",
        pathname: "/helix/moderation/channels",
        query: {
            user_id: String(channelId)
        }
    }), {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Client-Id": process.env.NUXT_OAUTH_TWITCH_CLIENT_ID as string,
        }
    })
    if (userModsRequests.status === 200) {
        let modsData = await userModsRequests.json()
        let channelList: Array<z.infer<typeof TwitchChannel>> = [{id: channelId, name: channelName}]
        for (let streamer of modsData.data) {
            channelList.push({id: Number(streamer.broadcaster_id), name: String(streamer.broadcaster_name)})
        }
        return channelList
    } else {
        return []
    }
}

export async function fetchChannelInfo(channel: {id?: number, name?: string}, clientId = "", clientSecret = "") {
    if (channel.name || channel.id) {
        const tokenRequest = await fetch(url.format({
            protocol: "https",
            hostname: "id.twitch.tv",
            pathname: "/oauth2/token",
            query: {
                client_id: clientId ? clientId : process.env.NUXT_OAUTH_TWITCH_CLIENT_ID as string,
                client_secret: clientSecret ? clientSecret : process.env.NUXT_OAUTH_TWITCH_CLIENT_SECRET as string,
                grant_type: 'client_credentials',
            }
        }), {method: "POST"})
        if (tokenRequest.status === 200) {
            let tokenData = await tokenRequest.json()
            let userRequestUrl = {
                protocol: "https",
                hostname: "api.twitch.tv",
                pathname: "/helix/users",
                query: {}
            }
            if (channel.name) {
                // @ts-ignore
                userRequestUrl.query.login = channel.name
            } else {
                // @ts-ignore
                userRequestUrl.query.id = String(channel.id)
            }
            const userRequest = await fetch(url.format(userRequestUrl), {
                headers: {
                    "Authorization": `Bearer ${tokenData.access_token}`,
                    "Client-Id": clientId ? clientId : process.env.NUXT_OAUTH_TWITCH_CLIENT_ID as string,
                }
            })
            if (userRequest.status === 200) {
                let data = await userRequest.json()
                return data.data[0]
            } else {
                console.log(`User Request ${await userRequest.text()}`)
            }
        } else {
            console.log(`Token Request ${await tokenRequest.text()}`)
        }
    }
    return null
}