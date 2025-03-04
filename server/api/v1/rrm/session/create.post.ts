import {createSession as schema} from "~/server/schema/rrm/session";
import {validateRequest} from "~/server/utils/api";
import {createSession} from "~/server/utils/rrm/session";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema, false)
    await createSession(context.body.user, context.body.owner, context.body.channels, true)
})