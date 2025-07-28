import {tables, useDrizzle} from "~/server/utils/drizzle";
import {validateRequest} from "~/server/utils/api";
import {addCard as schema} from "~/server/schema/modcorp/cards";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    if (context.body.token !== process.env.MODCORP_TOKEN) {
        throw createError({statusCode: 400, statusMessage: `Invalid token.`})
    }

    let db = useDrizzle()

    try {
        let newCard = await db.insert(tables.ModCorp_Cards).values({
            "name": context.body.name,
            "description": context.body.description,
            "file": context.body.file,
            "rarity": context.body.rarity,
        }).returning()
        if (newCard) {
            await db.insert(tables.ModCorp_Logs).values({
                "user_name": context.body.user_name,
                "user_id": context.body.user_id,
                "action": `Created a new card [${newCard[0].id}] ${newCard[0].name} (${newCard[0].rarity}).`,
                "reason": null,
                "timestamp": new Date().toISOString()
            })
            return newCard
        } else {
            throw createError({statusCode: 400, statusMessage: `Failed to create a new card.`})
        }
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to create a new card.`})
    }
})


