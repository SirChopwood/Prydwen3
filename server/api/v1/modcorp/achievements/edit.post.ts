import {tables, useDrizzle} from "~/server/utils/drizzle";
import {validateRequest} from "~/server/utils/api";
import {editAchievement as schema} from "~/server/schema/modcorp/achievements";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    if (context.body.token !== process.env.MODCORP_TOKEN) {
        throw createError({statusCode: 400, statusMessage: `Invalid token.`})
    }

    let db = useDrizzle()
    let result: Array<object> | null = null

    try {
        if (context.body.name) {
            result = await db.update(tables.ModCorp_Achievements)
                .set({name: context.body.name})
                .where(eq(tables.ModCorp_Achievements.id, context.body.id))
                .returning()
        }
        if (context.body.description) {
            result = await db.update(tables.ModCorp_Achievements)
                .set({description: context.body.description})
                .where(eq(tables.ModCorp_Achievements.id, context.body.id))
                .returning()
        }
        if (context.body.file) {
            result = await db.update(tables.ModCorp_Achievements)
                .set({file: context.body.file})
                .where(eq(tables.ModCorp_Achievements.id, context.body.id))
                .returning()
        }
        if (context.body.type) {
            result = await db.update(tables.ModCorp_Achievements)
                .set({type: context.body.type})
                .where(eq(tables.ModCorp_Achievements.id, context.body.id))
                .returning()
        }
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to edit Achievement.`})
    }

    if (result && result.length > 0) {
        await db.insert(tables.ModCorp_Logs).values({
            "user_name": context.body.user_name,
            "user_id": context.body.user_id,
            "action": `Edited the data of achievement [${context.body.id}].`,
            "reason": null,
            "timestamp": new Date().toISOString()
        })
        return result
    } else {
        throw createError({statusCode: 400, statusMessage: `Could not find achievement or value to edit.`})
    }
})


