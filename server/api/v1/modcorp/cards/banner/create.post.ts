import {tables, useDrizzle} from "~/server/utils/drizzle";
import {validateRequest} from "~/server/utils/api";
import {addBanner as schema} from "~/server/schema/modcorp/cards";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    if (context.body.token !== process.env.MODCORP_TOKEN) {
        throw createError({statusCode: 400, statusMessage: `Invalid token.`})
    }

    let db = useDrizzle()

    try {
        let newBanner = await db.insert(tables.ModCorp_Banners).values({
            "name": context.body.name,
            "description": context.body.description,
            "file": context.body.file,
            "contents": context.body.contents,
            "active": context.body.active
        }).returning()
        if (newBanner) {
            await db.insert(tables.ModCorp_Logs).values({
                "user_name": context.body.user_name,
                "user_id": context.body.user_id,
                "action": `Created a new banner [${newBanner[0].id}] ${newBanner[0].name}.`,
                "reason": null,
                "timestamp": new Date().toISOString()
            })
            return newBanner
        } else {
            throw createError({statusCode: 400, statusMessage: `Failed to create a new banner.`})
        }
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to create a new card.`})
    }
})


