import {fetchModeratedChannels} from "~/server/utils/rrm/twitch";
import {fetchSession} from "~/server/schema/rrm/session";
import {fetchUserSession, validateRequest} from "~/server/utils/api";
import {fetchSessionByChannel} from "~/server/utils/rrm/session";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, fetchSession, false)

    let activeSessions: Array<RRM_Session> = []
    if (context.body.channel) {
        activeSessions = await fetchSessionByChannel(context.body.channel, true)
    } else {
        const userSession = await fetchUserSession(event)
        const modChannels = await fetchModeratedChannels(Number(userSession.user!.id), userSession.user!.display_name, userSession.secure!.access_token)
        if (modChannels.length > 0) {

            // Iterate through all modded channels
            for (let channel of modChannels) {
                let channelSession = await fetchSessionByChannel(channel)
                if (channelSession.length > 0) {
                    let sessionUnique = true
                    // Make sure not to add duplicate entries
                    for (let activeSession of activeSessions) {
                        if (activeSession.id === channelSession[0].id) {
                            sessionUnique = false
                        }
                    }
                    if (sessionUnique) {
                        activeSessions.push(channelSession[0])
                    }
                    console.log(activeSessions)
                }
            }
        } else {
            throw createError({statusCode: 400, statusMessage: "User is not authenticated."})
        }
    }
    return activeSessions
})