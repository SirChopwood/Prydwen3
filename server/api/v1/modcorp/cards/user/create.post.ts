import {tables, useDrizzle} from "~/server/utils/drizzle";
import {validateRequest} from "~/server/utils/api";
import {addUser as schema} from "~/server/schema/modcorp/cards";
import {integer, text} from "drizzle-orm/sqlite-core";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    if (context.body.token !== process.env.MODCORP_TOKEN) {
        throw createError({statusCode: 400, statusMessage: `Invalid token.`})
    }

    let db = useDrizzle()

    try {
        let newUser = await db.insert(tables.ModCorp_UserCards).values({
            "user_id": Number(context.body.user_id)
        }).returning()
        if (newUser) {
            await db.insert(tables.ModCorp_Logs).values({
                "user_name": context.body.user_name,
                "user_id": context.body.user_id,
                "action": `Added user to card system.`,
                "reason": null,
                "timestamp": new Date().toISOString()
            })
            return newUser
        } else {
            throw createError({statusCode: 400, statusMessage: `Failed to add the user.`})
        }
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to add the user.`})
    }
})


