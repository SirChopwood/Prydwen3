import {createSession as schema} from "~/server/schema/rrm/session";
import {validateRequest} from "~/server/utils/api";
import {createSession} from "~/server/utils/rrm/session";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema, false)
    let ownerSession = await fetchSessionByChannel(context.body.owner)
    if (ownerSession && ownerSession.length > 0) {
        throw createError({statusCode: 400, statusMessage: `Channel ${context.body.owner.name} is already in an active session.`})
    }
    for (let channel of context.body.channels) {
        let channelSession = await fetchSessionByChannel(channel)
        if (channelSession && channelSession.length > 0) {
            throw createError({statusCode: 400, statusMessage: `Channel ${channel.name} is already in an active session.`})
        }
    }
    return await createSession(context.body.user, context.body.owner, context.body.channels, context.body.sources, true)
})