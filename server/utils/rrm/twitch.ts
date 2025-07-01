import url from "url"
import {TwitchChannel} from "~/server/schema/rrm/twitch";
import {z} from "zod";
import {methods} from "netlify";

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
        let streamerList: Array<z.infer<typeof TwitchChannel>> = [{id: channelId, name: channelName}]
        for (let streamer of modsData.data) {
            streamerList.push({id: Number(streamer.broadcaster_id), name: String(streamer.broadcaster_name)})
        }
        return streamerList
    } else {
        return []
    }
}

export async function fetchChannelInfo(channel: {id?: number, name?: string}) {
    if (channel.name || channel.id) {
        console.log(`Client ID: ${process.env.NUXT_OAUTH_TWITCH_CLIENT_ID}, client secret: ${process.env.NUXT_OAUTH_TWITCH_CLIENT_SECRET}`)
        const tokenRequest = await fetch(url.format({
            protocol: "https",
            hostname: "id.twitch.tv",
            pathname: "/oauth2/token",
            query: {
                client_id: process.env.NUXT_OAUTH_TWITCH_CLIENT_ID as string,
                client_secret: process.env.NUXT_OAUTH_TWITCH_CLIENT_SECRET as string,
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
                    "Client-Id": process.env.NUXT_OAUTH_TWITCH_CLIENT_ID as string,
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