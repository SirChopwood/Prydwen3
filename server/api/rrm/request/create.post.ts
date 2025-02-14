import {createRequest} from "~/server/schema/rrm/session";
import {getRequestsBySession, getSessionById} from "~/server/utils/rrm/session";
import {PrismaClient} from "@prisma/client";

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (body) => {
        return createRequest.parse(body)
    })

    const prisma = new PrismaClient()

    // Find existing session, ensuring it exists
    let session = await getSessionById(prisma, result.session)
    let requests = await getRequestsBySession(prisma, result.session, true)
    if (session) {
        if (session.status !== "Open" && !result.forceAdd) {
            throw createError({statusCode: 400, statusMessage: "Session is not open."})
        }

        if (requests) {
            for (let request of requests) {
                if (request.code === result.request) {
                    throw createError({statusCode: 400, statusMessage: "That has already been requested."})
                }
            }
        }

        // Create new request entry
        let newRequest = await prisma.rRM_Request.create({
            data: {
                text: result.request,
                user: result.user,
                code: result.request,
                metadata: JSON.stringify({colour: "#ffffff"}),
                session: session.id
            }
        })

        // Add new request to session request list
        let requestList = JSON.parse(session.requests)
        requestList.push(newRequest.id)

        // Update session with new list
        await prisma.rRM_Session.update({
            where: {
                id: session.id
            },
            data: {
                requests: JSON.stringify(requestList)
            }
        })
        return
    }
})