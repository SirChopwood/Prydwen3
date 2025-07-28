import {validateRequest} from "~/server/utils/api";
import {fetchUser as schema} from "~/server/schema/modcorp/cards";
import {useDrizzle} from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    let db = useDrizzle()
    let targetUser
    try {
        targetUser = await db.query.ModCorp_UserCards.findFirst({
            where: (user, {eq}) => {
                return eq(user.user_id, Number(context.body.user_id))
            }
        })
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to fetch User.`})
    }
    if (targetUser) {
        if (targetUser.cards.length > 0) {
            // @ts-ignore
            targetUser.cardData = await $fetch("/api/v1/modcorp/cards/card/fetch", {
                method: "POST",
                body: JSON.stringify({card_ids: targetUser.cards}),
            })
        } else {
            // @ts-ignore
            targetUser.cardData = []
        }
        return targetUser
    } else {
        throw createError({statusCode: 400, statusMessage: `No User found with that ID.`})
    }
})