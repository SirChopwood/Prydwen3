import {useDrizzle, tables} from "~/server/utils/drizzle";

export async function isSessionIdValid(sessionId: number, blocking: boolean = false) {
    return !!(await fetchSessionById(sessionId, blocking))
}

export async function fetchSessionById(sessionId: number, blocking: boolean = false) {
    let foundSession: RRM_Session | undefined
    try {
        foundSession = await useDrizzle().query.RRM_Session.findFirst({
            where: (sessions, {eq}) => {
                return eq(sessions.id, sessionId)
            },
            with: {
                requests: true,
                RRM_SessionToChannels: {
                    with: {
                        channel: true
                    }
                }
            }
        })
    } catch (error) {
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: `Session '${sessionId}' could not be found.`})
        }
    }
    if (foundSession) {
        return foundSession
    } else {
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: `Session '${sessionId}' does not exist.`})
        }
    }
}

export async function fetchSessionByChannel(channelId: number, channelName: string, blocking: boolean = false) {
    let foundSession: RRM_Session | undefined
    try {
        foundSession = await useDrizzle().query.RRM_Session.findFirst({
            where: (sessions, {eq}) => {
                return eq(sessions.ownerId, channelId)
            },
            with: {
                requests: true,
                RRM_SessionToChannels: {
                    with: {
                        channel: true
                    }
                }
            }
        })
    } catch (error) {
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: `No Session for '${channelName}' could be found.`})
        }
    }
    if (foundSession) {
        return foundSession
    } else {
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: `No Session for '${channelName}' could be found.`})
        }
    }
}

export async function createSession(user: string, owningChannel: {id: number, name: string}, additionalChannels: Array<{id: number, name: string}>, blocking: boolean = false) {
    let db = useDrizzle()
    try {
        // First, insert the session
        const newSession = await db.insert(tables.RRM_Session).values({
            startTime: new Date().toISOString(),
            lastUser: user,
            ownerId: owningChannel.id,
            status: "Open"
        }).returning()

        // Then insert the channel relationships including the owner and additional channels
        try {
            const channelRelations = additionalChannels.map(channel => ({
                sessionId: newSession[0].id,
                channelId: channel.id
            }))

            await db.insert(tables.RRM_SessionToChannels).values(channelRelations);
        } catch (error) {
            // If the channel relations insert fails, clean up the session
            await db.delete(tables.RRM_Session).where(eq(tables.RRM_Session.id, newSession[0].id))
            throw error
        }
    } catch (error) {
        console.log(error)
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: `Failed to create new Session.`})
        }
    }
    return await fetchSessionByChannel(owningChannel.id, owningChannel.name)
}