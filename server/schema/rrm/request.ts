import {z} from "zod"

export const createRequest = z.strictObject({
    "user": z.string(),
    "request": z.string(),
    "session": z.number(),
    "forceAdd": z.boolean().optional(),
})

export const fetchRequests = z.strictObject({
    "sessionId": z.number().optional(),
})

export const removeRequest = z.strictObject({
    "request": z.number(),
})