import {fetchChannelInfo} from "~/server/utils/rrm/twitch";
import {validateRequest} from "~/server/utils/api";
import {setListener} from "~/server/schema/rrm/events";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, setListener, false)
    const session = await useSession(event, {name: "RRM-Overlay", password: process.env.NUXT_SESSION_PASSWORD!})

    let targetChannel = await fetchChannelInfo({name: context.body.channelName})

    if (targetChannel) {
        if (session.data) {
            session.data.targetChannel = {name: String(targetChannel.display_name), id: Number(targetChannel.id)}
            await session.update(session.data)
        } else {
            await session.update({targetChannel: {name: String(targetChannel.display_name), id: Number(targetChannel.id)}})
        }
        return `Channel Set to ${targetChannel}`
    } else {
        throw createError({statusCode: 400, statusMessage: "Unable to fetch channel."})
    }
})