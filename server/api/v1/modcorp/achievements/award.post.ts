import {tables, useDrizzle} from "~/server/utils/drizzle";
import {validateRequest} from "~/server/utils/api";
import {awardAchievement as schema} from "~/server/schema/modcorp/achievements";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    if (context.body.token !== process.env.MODCORP_TOKEN) {
        throw createError({statusCode: 400, statusMessage: `Invalid token.`})
    }

    let db = useDrizzle()
    let achievement = await $fetch("/api/v1/modcorp/achievements/fetch", {
        method: "POST",
        body:{
            "id": context.body.achievement
        }
    })
    if (!achievement || !achievement[0]) {throw createError({statusCode: 400, statusMessage: `Achievement not found!`})}

    try {
        let newAward = await db.insert(tables.ModCorp_AwardedAchievements).values({
            "user_id": context.body.target,
            "achievement": achievement[0].id,
            "timestamp": new Date().toISOString(),
            "note": context.body.note || "",
            "tier": context.body.tier || 0,
        }).returning()
        if (newAward) {
            await db.insert(tables.ModCorp_Logs).values({
                "user_name": context.body.user_name,
                "user_id": context.body.user_id,
                "action": `Awarded achievement [${achievement[0].id}] ${achievement[0].name} to user ${newAward[0].user_id}.`,
                "reason": context.body.note || "",
                "timestamp": new Date().toISOString()
            })
            return newAward
        } else {
            throw createError({statusCode: 400, statusMessage: `Failed to award Achievement.`})
        }
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to award Achievement.`})
    }
})


