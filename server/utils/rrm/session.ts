import {PrismaClient} from "@prisma/client";
import {TwitchChannel} from "~/server/schema/rrm/twitch";
import {z} from "zod"

export async function isChannelRegistered(prisma: PrismaClient, channel: z.infer<typeof TwitchChannel>, silent: boolean = false) {
    return !!(await getChannel(prisma, channel, silent))
}

export async function getChannel(prisma: PrismaClient, channel: z.infer<typeof TwitchChannel>, silent: boolean = false) {
    let foundChannel = await prisma.rRM_TwitchChannel.findUnique({
        where: {
            id: channel.id,
            name: channel.name,
        }
    })
    if (foundChannel) {
        return foundChannel
    } else if (!silent) {
        throw createError({statusCode: 400, statusMessage: `Channel '${channel.name}' not registered.`})
    } else {
        return
    }
}

export async function isChannelInActiveSession(prisma: PrismaClient, channel: z.infer<typeof TwitchChannel>) {
    let sessions = await getActiveSessionsFromOwner(prisma, channel, true)
    if (sessions.length === 0) {
        return false
    } else {
        throw createError({statusCode: 400, statusMessage: "Channel is already in an active session."})
    }
}

export async function getActiveSessionsFromOwner(prisma: PrismaClient, owner: z.infer<typeof TwitchChannel>, silent: boolean = false) {
    await isChannelRegistered(prisma, owner, silent)
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
            joinedChannels: true,
        }
    })
    if (sessions.length > 0) {
        return sessions
    } else if (!silent) {
        throw createError({statusCode: 400, statusMessage: "Channel is not in an active session."})
    } else {
        return []
    }
}

export async function getSessionById(prisma: PrismaClient, sessionId: number, silent: boolean = false) {
    let session = await prisma.rRM_Session.findUnique({
        where: {
            id: sessionId
        },
        include: {
            owner: true,
            joinedChannels: true,
        }
    })
    if (!session && !silent) {
        throw createError({statusCode: 400, statusMessage: "Session not found."})
    } else {
        return session
    }
}

export async function getRequestsBySession(prisma: PrismaClient, sessionId: number, silent: boolean = false) {
    let requests = await prisma.rRM_Request.findMany({
        where: {
            session: sessionId
        }
    })
    if (!requests && !silent) {
        throw createError({statusCode: 400, statusMessage: "Session not found or has no requests."})
    } else {
        return requests
    }
}