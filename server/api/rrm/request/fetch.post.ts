import {fetchRequests} from "~/server/schema/rrm/session";
import {PrismaClient, RRM_Request} from "@prisma/client";
import {getRequestsBySession} from "~/server/utils/rrm/session";

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (body) => {
        return fetchRequests.parse(body)
    })
    const prisma = new PrismaClient()
    let requests = await getRequestsBySession(prisma, result.session, true)
    let requestObject = {} as Record<string, RRM_Request>
    for (let request of requests) {
        requestObject[String(request.id)] = request
    }
    return requestObject
})