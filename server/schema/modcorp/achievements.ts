import {z} from "zod"

export const createAchievement = z.strictObject({
    "token": z.string(),
    "user_name": z.string(),
    "user_id": z.string(),
    "name": z.string(),
    "description": z.string(),
    "file": z.string(),
    "type": z.enum(["Medal", "Ribbon", "Participation"])
})

export const editAchievement = z.strictObject({
    "token": z.string(),
    "user_name": z.string(),
    "user_id": z.string(),
    "id": z.number().min(0),
    "name": z.string().optional(),
    "description": z.string().optional(),
    "file": z.string().optional(),
    "type": z.enum(["Medal", "Ribbon", "Participation"]).optional()
})

export const fetchAchievement = z.strictObject({
    "id": z.number().min(0),
})

export const awardAchievement = z.strictObject({
    "token": z.string(),
    "user_name": z.string(),
    "user_id": z.string(),
    "target": z.string(),
    "achievement": z.number().min(0),
    "note": z.string().optional(),
})