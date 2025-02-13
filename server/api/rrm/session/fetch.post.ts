import {PrismaClient, RRM_Session} from "@prisma/client";
import {fetchSession} from "~/server/schema/rrm/session";
import {getActiveSessionsFromOwner, getSessionById, isChannelRegistered} from "~/server/utils/rrm/session";
import {getModeratedChannels} from "~/server/utils/rrm/twitch";

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (body) => {
        return fetchSession.parse(body)
    })
    const prisma = new PrismaClient()
    const userSession = await getUserSession(event)
    const modChannels = await getModeratedChannels(userSession)

    if (modChannels) {
        if (result.session) {
            if (modChannels.includes(result.session)) {
                return [await getSessionById(prisma, Number(result.session.id))]
            }
        } else {
            let activeSessions = [] as Array<object>
            // Iterate through all channels user is modded in.
            for (let modChannel of modChannels) {

                // Ensures channel exists in system
                if (await isChannelRegistered(prisma, modChannel, true)) {
                    let foundSessions = await getActiveSessionsFromOwner(prisma, modChannel, true)

                    // gets all active sessions and adds them to the list if not already present
                    for (let foundSession of foundSessions) {
                        if (!activeSessions.includes(foundSession)) {
                            activeSessions.push(foundSession)
                        }
                    }
                }
            }
            return activeSessions
        }
    }
})