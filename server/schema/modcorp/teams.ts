import {z} from "zod"

export const createTeam = z.strictObject({
    "token": z.string(),
    "user_name": z.string(),
    "user_id": z.string(),
    "name": z.string(),
    "description": z.string(),
    "colour": z.string(),
    "logo_url": z.string(),
    "discord": z.strictObject({
        "role": z.string(),
        "channel": z.string(),
        "server": z.string(),
    })
})

export const editTeam = z.strictObject({
    "token": z.string(),
    "user_name": z.string(),
    "user_id": z.string(),
    "id": z.number().min(0),
    "name": z.string().optional(),
    "description": z.string().optional(),
    "colour": z.string().optional(),
    "logo_url": z.string().optional(),
    "discord": z.strictObject({
        "role": z.string(),
        "channel": z.string(),
        "server": z.string(),
    }).optional(),
})

export const editScore = z.strictObject({
    "token": z.string(),
    "user_name": z.string(),
    "user_id": z.string(),
    "id": z.number().min(0),
    "score": z.number(),
    "reason": z.string(),
})

export const fetchTeam = z.strictObject({
    "id": z.number().min(0).optional(),
    "name": z.string().optional(),
})