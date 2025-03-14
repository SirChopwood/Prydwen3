import {createRequest as schema} from "~/server/schema/rrm/request";
import {validateRequest} from "~/server/utils/api";
import {createRequest} from "~/server/utils/rrm/request";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema, false)

    let request = {text: "", code: "", metadata: {} as Record<string, string>}

    // Add code for poking the Pypy/YT APIs

    request.text = context.body.request
    request.code = context.body.request
    request.metadata["Test"] = "FooBar"

    return await createRequest(context.body.session, context.body.user, request, true)
})