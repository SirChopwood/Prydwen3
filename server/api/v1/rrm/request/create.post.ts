import {createRequest as schema} from "~/server/schema/rrm/request";
import {validateRequest} from "~/server/utils/api";
import {createRequest} from "~/server/utils/rrm/request";
import {Sources} from "~/server/utils/rrm/sources";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema, false)

    let session = await fetchSessionById(context.body.session, true)
    if (session) {
        const request = context.body.request

        for (let sourceName of session.sources) {
            let result
            try {
                result = await Sources[String(sourceName)](request)
            } catch (e) {
                console.log(`Failed to process ${request} as ${sourceName}, with Error: ${e}`)
                continue
            }
            if (result) {
                console.log(`Processed ${request} as ${sourceName}.`)
                return await createRequest(context.body.session, context.body.user, result, true)
            } else {
                console.log(`Failed to process ${request} as ${sourceName}.`)
            }
        }
        console.log(`Request could not be validated in any sources.`)
        throw createError({statusCode: 404, statusMessage: `Request could not be validated in any of the following Sources: ${String(session.sources)}.`})
    }
})