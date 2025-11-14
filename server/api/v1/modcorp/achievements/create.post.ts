import {tables, useDrizzle} from "~/server/utils/drizzle";
import {validateRequest} from "~/server/utils/api";
import {createAchievement as schema} from "~/server/schema/modcorp/achievements";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    if (context.body.token !== process.env.MODCORP_TOKEN) {
        throw createError({statusCode: 400, statusMessage: `Invalid token.`})
    }

    let db = useDrizzle()

    try {
        let newAchievement = await db.insert(tables.ModCorp_Achievements).values({
            "name": context.body.name,
            "description": context.body.description,
            "file": context.body.file,
            "type": context.body.type,
            "tiers": context.body.tiers,
        }).returning()
        if (newAchievement) {
            await db.insert(tables.ModCorp_Logs).values({
                "user_name": context.body.user_name,
                "user_id": context.body.user_id,
                "action": `Created achievement [${newAchievement[0].id}] ${newAchievement[0].name}.`,
                "reason": null,
                "timestamp": new Date().toISOString()
            })
            return newAchievement
        } else {
            throw createError({statusCode: 400, statusMessage: `Failed to create Achievement.`})
        }
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to create Achievement.`})
    }
})


