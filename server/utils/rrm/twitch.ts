import url from "url"
import {TwitchChannel} from "~/server/schema/rrm/twitch";
import {z} from "zod";

// Returns the twitch data of the user whose token is provided.
export async function getUserByToken(token:string) {
    const userDataRequest = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Client-Id": process.env.TWITCH_CLIENTID as string,
        }
    })
    if (userDataRequest.status === 200) {
        return await userDataRequest.json()
    } else {
        return null
    }
}

// Returns a list of usernames and ids for livestreams the user is following.
export async function getFollowedStreams(token: string) {
    let userData = await getUserByToken(token)
    const userFollowsRequest = await fetch(url.format({
        protocol: "https",
        hostname: "api.twitch.tv",
        pathname: "/helix/streams/followed",
        query: {
            user_id: userData.data[0].id
        }
    }), {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Client-Id": process.env.TWITCH_CLIENTID as string,
        }
    })
    if (userFollowsRequest.status === 200) {
        let followData = await userFollowsRequest.json()
        let streamerList: Array<z.infer<typeof TwitchChannel>> = []
        for (let streamer of followData.data) {
            streamerList.push({id: streamer.id, name: streamer.user_name})
        }
        return streamerList
    } else {
        return null
    }
}

// Returns a list of usernames and ids for channels the user has moderator permissions in.
export async function getModeratedChannels(userSession: any) {
    const userModsRequests = await fetch(url.format({
        protocol: "https",
        hostname: "api.twitch.tv",
        pathname: "/helix/moderation/channels",
        query: {
            user_id: userSession.user.id
        }
    }), {
        headers: {
            "Authorization": `Bearer ${userSession.secure.access_token}`,
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