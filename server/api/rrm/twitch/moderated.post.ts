import {getModeratedChannels} from "~/server/utils/rrm/twitch";
import {getUserSession} from "#imports";

export default defineEventHandler(async (event) => {
    let userSession = await getUserSession(event)
    if (userSession.secure) {
        return await getModeratedChannels(userSession)
    }
})