import {PrismaClient} from "@prisma/client";
import {fetchSession} from "~/server/schema/rrm/session";
import {getActiveSessionFromOwner, isChannelRegistered} from "~/server/utils/rrm/session";

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (body) => {
        return fetchSession.parse(body)
    })

    const prisma = new PrismaClient()

    // Check channels all exist, throws error if not
    await isChannelRegistered(prisma, result.channel)
    // Return the new Session
    return getActiveSessionFromOwner(prisma, result.channel)
})