import {fetchModeratedChannels, isChannelRegistered} from "~/server/utils/rrm/twitch";
import {fetchSession} from "~/server/schema/rrm/session";
import {fetchUserSession, validateRequest} from "~/server/utils/api";
import {fetchSessionByChannel} from "~/server/utils/rrm/session";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, fetchSession, false)

    let activeSessions = [] as Array<RRM_Session>
    if (context.body.channel) {
        let activeSession = await fetchSessionByChannel(context.body.channel.id, context.body.channel.name)
        if (activeSession) {
            activeSessions.push(activeSession)
        }
    } else {
        const userSession = await fetchUserSession(event)
        const modChannels = await fetchModeratedChannels(Number(userSession.user!.id), userSession.user!.display_name, userSession.secure!.access_token)
        if (modChannels.length > 0) {

            // Iterate through all modded channelss
            for (let channel of modChannels) {

                // If channel is registered, get its session.
                if (await isChannelRegistered(channel)) {
                    let channelSession = await fetchSessionByChannel(channel.id, channel.name)

                    // Make sure not to add duplicate entries
                    if (channelSession && !(activeSessions.includes(channelSession))) {
                        activeSessions.push(channelSession)
                    }
                }
            }
        } else {
            throw createError({statusCode: 400, statusMessage: "User is not authenticated."})
        }
    }
    return activeSessions
})