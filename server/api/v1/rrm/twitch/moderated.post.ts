import {getUserSession} from "#imports";
import {fetchModeratedChannels} from "~/server/utils/rrm/twitch";

export default defineEventHandler(async (event) => {
    let userSession = await getUserSession(event)
    if (userSession.user && userSession.secure) {
        return await fetchModeratedChannels(userSession.user.id, userSession.secure.access_token)
    } else {
        throw createError({statusCode: 400, statusMessage: "User is not authenticated."})
    }
})