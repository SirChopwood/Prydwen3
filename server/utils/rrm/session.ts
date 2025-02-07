import {PrismaClient} from "@prisma/client";
import {TwitchChannel} from "~/server/schema/rrm/twitch";
import {z} from "zod"

export async function isChannelRegistered(prisma: PrismaClient, channel: z.infer<typeof TwitchChannel>) {
    if (await getChannel(prisma, channel)) {
        return true
    }
}

export async function getChannel(prisma: PrismaClient, channel: z.infer<typeof TwitchChannel>) {
    let foundChannel = await prisma.rRM_TwitchChannel.findUnique({
        where: {
            id: channel.id,
            name: channel.name,
        }
    })
    if (foundChannel) {
        return foundChannel
    } else {
        throw createError({statusCode: 400, statusMessage: `Channel '${channel.name}' not registered.`})
    }
}

export async function isChannelInActiveSession(prisma: PrismaClient, channel: z.infer<typeof TwitchChannel>) {
    let sessions = await getActiveSessionFromOwner(prisma, channel)
    if (sessions.length === 0) {
        return true
    } else {
        throw createError({statusCode: 400, statusMessage: "Channel is already in an active session."})
    }
}

export async function getActiveSessionFromOwner(prisma: PrismaClient, owner: z.infer<typeof TwitchChannel>) {
    await isChannelRegistered(prisma, owner)
    let sessions = await prisma.rRM_Session.findMany({
        where: {
            OR: [
                {
                    ownerId: {
                        equals: owner.id
                    },
                    status: {
                        in: ["Locked", "Open"]
                    }
                },
                {
                    joinedChannels: {
                        some: {
                            id: {
                                equals: owner.id
                            },
                            name: {
                                equals: owner.name
                            }
                        }
                    },
                    status: {
                        in: ["Locked", "Open"]
                    }
                }
            ]
        },
        include: {
            owner: true,
            requests: true,
            joinedChannels: true,
        }
    })
    if (sessions.length > 0) {
        return sessions
    } else {
        throw createError({statusCode: 400, statusMessage: "Channel is not in an active session."})
    }
}