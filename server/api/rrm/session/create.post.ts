import {PrismaClient} from "@prisma/client";
import {createSession} from "~/server/schema/rrm/session";
import {isChannelInActiveSession} from "~/server/utils/rrm/session";

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (body) => {
        return createSession.parse(body)
    })

    const prisma = new PrismaClient()

    // Check channels all exist and are not already in a session, throws errors if not
    await isChannelInActiveSession(prisma, result.owner)
    for (let channel of result.channels) {
        await isChannelInActiveSession(prisma, channel)
    }

    // await prisma.rRM_TwitchChannel.create({
    //     data: {
    //         id: 1234568,
    //         name: "test",
    //         colour: "#ffbb00"
    //     }
    // })

    // Create new Session
    await prisma.rRM_Session.create({
        data: {
            owner: {
                connect: {
                    id: result.owner.id,
                }
            },
            lastUser: result.user,
        },
        include: {
            owner: true
        }
    })

    // result["twitch"] = await prisma.rRM_TwitchChannel.findFirst({
    //     where: {
    //         id: {
    //             equals: result.owner.Id
    //         }
    //     },
    //     include: {
    //         ownedSessions: true,
    //         joinedSessions: true,
    //     }
    // })

    // Return the new Session
    return prisma.rRM_Session.findMany({
        where: {
            ownerId: {
                equals: result.owner.id
            },
            status: {
                equals: "Locked"
            }
        },
        include: {
            owner: true,
            requests: true,
            joinedChannels: true,
        }
    })
})