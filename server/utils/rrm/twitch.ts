import url from "url"
import {TwitchChannel} from "~/server/schema/rrm/twitch";
import {z} from "zod";

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