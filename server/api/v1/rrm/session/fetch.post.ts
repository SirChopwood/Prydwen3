import {fetchModeratedChannels} from "~/server/utils/rrm/twitch";
import {fetchSession} from "~/server/schema/rrm/session";
import {fetchUserSession, validateRequest} from "~/server/utils/api";
import {fetchSessionByChannel} from "~/server/utils/rrm/session";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, fetchSession, false)

    let activeSessions: Array<RRM_Session> = []
    if (context.body.channel && !context.body.force) {
        activeSessions = await fetchSessionByChannel(context.body.channel, true)
    } else if (context.body.sessionId) {
        let sessionFound = await fetchSessionById(context.body.sessionId, true)
        if (sessionFound) {
            activeSessions.push(sessionFound)
        }
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
                }
            }
        } else {
            throw createError({statusCode: 401, statusMessage: "User is not authenticated."})
        }
    }
    return activeSessions
})