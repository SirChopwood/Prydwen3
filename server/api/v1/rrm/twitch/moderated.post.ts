import {getUserSession} from "#imports";
import {fetchPermittedChannels} from "~/server/utils/rrm/twitch";

export default defineEventHandler(async (event) => {
    let userSession = await getUserSession(event)
    if (userSession.user && userSession.secure) {
        return await fetchPermittedChannels(Number(userSession.user.id), userSession.user.display_name, userSession.secure.access_token)
    } else {
        throw createError({statusCode: 400, statusMessage: "User is not authenticated."})
    }
})