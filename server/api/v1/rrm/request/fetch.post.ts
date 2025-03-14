import {validateRequest} from "~/server/utils/api";
import {fetchRequests} from "~/server/schema/rrm/request";
import {fetchRequestsBySession} from "~/server/utils/rrm/request";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, fetchRequests, false)
    return await fetchRequestsBySession(context.body.session)
})