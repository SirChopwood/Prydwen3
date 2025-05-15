import {createRequest as schema} from "~/server/schema/rrm/request";
import {validateRequest} from "~/server/utils/api";
import {createRequest} from "~/server/utils/rrm/request";
import {Sources} from "~/server/utils/rrm/sources";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema, false)

    let session = await fetchSessionById(context.body.session, true)
    if (session) {
        for (let sourceName of session.sources) {
            let result = await Sources[String(sourceName)](context.body.request)
            if (result) {
                return await createRequest(context.body.session, context.body.user, result, true)
            }
        }
        throw createError({statusCode: 400, statusMessage: `Request could not be validated in any of the following Sources: ${String(session.sources)}.`})
    }
})