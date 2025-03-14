import {useDrizzle, tables} from "~/server/utils/drizzle";

// Check if a session ID is valid.
export async function isSessionIdValid(sessionId: number, blocking: boolean = false) {
    return !!(await fetchSessionById(sessionId, blocking))
}

// Fetch a session by its ID.
export async function fetchSessionById(sessionId: number, blocking: boolean = false) {
    let foundSession: RRM_Session | undefined
    try {
        foundSession = await useDrizzle().query.RRM_Session.findFirst({
            where: (sessions, {eq}) => {
                return eq(sessions.id, sessionId)
            }
        })
    } catch (error) {
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: `Session '${sessionId}' could not be found.`})
        }
    }
    if (!foundSession && blocking) {
        throw createError({statusCode: 400, statusMessage: `Session '${sessionId}' does not exist.`})
    } else {
        return foundSession
    }
}

// Fetch the current session of a given Twitch Channel.
export async function fetchSessionByChannel(channel: {id: number, name: string}, blocking: boolean = false) {
    let foundSessions: Array<RRM_Session> = []
    try {
        let sessionQuery = await useDrizzle().select().from(tables.RRM_Session).where(
            and(
                or(
                    sql`(SELECT 1 FROM json_each(channels) WHERE (value = json(${JSON.stringify(channel)})))`, // Iterate through channels to see if one matches
                    eq(tables.RRM_Session.owner, channel)
                ),
                ne(tables.RRM_Session.status, "Closed")
            )
        )
        if (sessionQuery && sessionQuery[0] !== null) {
            foundSessions = sessionQuery
        }
    } catch (error) {
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: `No Session for '${channel.name}' could be found.`})
        }
    }
    if (!foundSessions && blocking) {
        throw createError({statusCode: 400, statusMessage: `No Session for '${channel.name}' could be found.`})
    } else {
        return foundSessions
    }
}

// Create a new session in the database.
export async function createSession(user: string, owningChannel: {id: number, name: string}, additionalChannels: Array<{id: number, name: string}> = [], blocking: boolean = false) {
    let db = useDrizzle()
    try {
        await db.insert(tables.RRM_Session).values({
            startTime: new Date().toISOString(),
            lastUser: user,
            owner: owningChannel,
            status: "Open",
            channels: additionalChannels
        })
    } catch (error) {
        console.log(error)
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: `Failed to create new Session.`})
        }
    }
    return await fetchSessionByChannel(owningChannel)
}