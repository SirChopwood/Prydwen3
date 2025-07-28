import {tables, useDrizzle} from "~/server/utils/drizzle";
import {validateRequest} from "~/server/utils/api";
import {awardRoll as schema} from "~/server/schema/modcorp/cards";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    if (context.body.token !== process.env.MODCORP_TOKEN) {
        throw createError({statusCode: 400, statusMessage: `Invalid token.`})
    }

    let db = useDrizzle()
    let result: Array<object> | null = null
    let total = 0

    try {
        let targetUser = await db.query.ModCorp_UserCards.findFirst({
            where: (user, {eq}) => {
                return eq(user.user_id, Number(context.body.user_id))
            }
        })
        if (!targetUser) {
            throw createError({statusCode: 400, statusMessage: `User not found.`})
        }
        total = targetUser.rolls + context.body.amount
        result = await db.update(tables.ModCorp_UserCards)
            .set({rolls: total})
            .where(eq(tables.ModCorp_UserCards.user_id, Number(context.body.user_id)))
            .returning()
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to edit User.`})
    }

    if (result && result.length > 0) {
        await db.insert(tables.ModCorp_Logs).values({
            "user_name": context.body.user_name,
            "user_id": context.body.user_id,
            "action": `${context.body.amount} rolls awarded, totalling ${total}`,
            "reason": context.body.reason,
            "timestamp": new Date().toISOString()
        })
        return result
    } else {
        throw createError({statusCode: 400, statusMessage: `Could edit User.`})
    }
})


