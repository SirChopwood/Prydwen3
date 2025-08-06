import {tables, useDrizzle} from "~/server/utils/drizzle";
import {fetchSessionById, isSessionIdValid} from "~/server/utils/rrm/session";

// Check a Request ID is valid.
export async function isRequestIdValid(requestId: number, blocking: boolean = false) {
    return !!(await fetchRequestById(requestId, blocking))
}

// Fetch a Request by its ID.
export async function fetchRequestById(requestId: number, blocking: boolean = false) {
    let foundRequest: RRM_Request | undefined
    try {
        foundRequest = await useDrizzle().query.RRM_Request.findFirst({
            where: (requests, {eq}) => {
                return eq(requests.id, requestId)
            }
        })
    } catch (error) {
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: `Request '${requestId}' could not be found.`})
        }
    }
    if (!foundRequest && blocking) {
        throw createError({statusCode: 400, statusMessage: `Request '${requestId}' does not exist.`})
    } else {
        return foundRequest
    }
}

// Fetch all Requests of a given Session.
export async function fetchRequestsBySession(sessionId: number, blocking: boolean = false) {
    let foundRequests: Array<RRM_Request> = []
    try {
        foundRequests = await useDrizzle().query.RRM_Request.findMany({
            where: (requests, {eq}) => {
                return eq(requests.sessionId, sessionId)
            }
        })
    } catch (error) {
        if (blocking) {
            throw createError({statusCode: 400, statusMessage: `Requests belonging to session '${sessionId}' could not be found.`})
        }
    }
    if (foundRequests.length === 0 && blocking) {
        throw createError({statusCode: 400, statusMessage: `Session '${sessionId}' does not exist or no requests could be found.`})
    } else {
        return foundRequests
    }
}

// Create a new Request in the DB and add it to its Session.
export async function createRequest(sessionId: number, user: string, request: {text: string, code: string, metadata: Record<string, string>}, blocking: boolean = false) {
    let newRequest: Array<RRM_Request> = []
    let db = useDrizzle()
    if (await isSessionIdValid(sessionId, blocking)) {
        try {
            newRequest = await db.insert(tables.RRM_Request).values({
                sessionId: sessionId,
                text: request.text,
                user: user,
                code: request.code,
                metadata: request.metadata,
                timestamp: new Date().toISOString(),
            }).returning()
            try {
                let session = await fetchSessionById(sessionId, blocking)
                let requests = session!.requests
                requests.push(newRequest[0].id)
                if (session) {
                    await db.update(tables.RRM_Session)
                        .set({requests: requests})
                        .where(eq(tables.RRM_Session.id, sessionId))
                }
            } catch (error) {
                console.log(error)
                if (blocking) {
                    throw createError({statusCode: 500, statusMessage: `Failed to add Request to Session.`})
                }
            }
        } catch (error) {
            console.log(error)
            if (blocking) {
                throw createError({statusCode: 500, statusMessage: `Failed to create new Request.`})
            }
        }
    }
    return newRequest
}