import {tables, useDrizzle} from "~/server/utils/drizzle";
import {validateRequest} from "~/server/utils/api";
import {editTeam as schema} from "~/server/schema/modcorp/teams";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    if (context.body.token !== process.env.MODCORP_TOKEN) {
        throw createError({statusCode: 400, statusMessage: `Invalid token.`})
    }

    let db = useDrizzle()
    let result: Array<object> | null = null

    try {
        if (context.body.name) {
            result = await db.update(tables.ModCorp_Team)
                .set({name: context.body.name})
                .where(eq(tables.ModCorp_Team.id, context.body.id))
                .returning()
        }
        if (context.body.description) {
            result = await db.update(tables.ModCorp_Team)
                .set({description: context.body.description})
                .where(eq(tables.ModCorp_Team.id, context.body.id))
                .returning()
        }
        if (context.body.colour) {
            result = await db.update(tables.ModCorp_Team)
                .set({colour: context.body.colour})
                .where(eq(tables.ModCorp_Team.id, context.body.id))
                .returning()
        }
        if (context.body.logo_url) {
            result = await db.update(tables.ModCorp_Team)
                .set({logo_url: context.body.logo_url})
                .where(eq(tables.ModCorp_Team.id, context.body.id))
                .returning()
        }
        if (context.body.discord) {
            result = await db.update(tables.ModCorp_Team)
                .set({discord: context.body.discord})
                .where(eq(tables.ModCorp_Team.id, context.body.id))
                .returning()
        }
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to edit Team.`})
    }

    if (result && result.length > 0) {
        await db.insert(tables.ModCorp_Logs).values({
            "user_name": context.body.user_name,
            "user_id": context.body.user_id,
            "action": `Edited the data of team [${context.body.id}].`,
            "reason": null,
            "timestamp": new Date().toISOString()
        })
        return result
    } else {
        throw createError({statusCode: 400, statusMessage: `Could not find team or value to edit.`})
    }
})


