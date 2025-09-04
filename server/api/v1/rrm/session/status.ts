import {validateRequest} from "~/server/utils/api";
import {setStatus as schema} from "~/server/schema/rrm/session";
import {tables, useDrizzle} from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema, false)
    let ownerSession = await fetchSessionById(context.body.sessionId)
    let db = useDrizzle()

    if (ownerSession) {
        let result = await db.update(tables.RRM_Session)
            .set({status: context.body.status})
            .where(eq(tables.RRM_Session.id, ownerSession.id))
            .returning()
        if (result && result.length > 0) {
            return result
        } else {
            throw createError({statusCode: 400, statusMessage: `Could not update session status.`})
        }
    } else {
        throw createError({statusCode: 400, statusMessage: `Could not find session.`})
    }
})