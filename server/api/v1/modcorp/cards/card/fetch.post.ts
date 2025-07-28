import {validateRequest} from "~/server/utils/api";
import {fetchCards as schema} from "~/server/schema/modcorp/cards";
import {useDrizzle} from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    let db = useDrizzle()
    let targetCards
    try {
        targetCards = await db.query.ModCorp_Cards.findMany({
            where: (card, {inArray}) => {
                return inArray(card.id, context.body.card_ids)
            }
        })
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to fetch Cards.`})
    }
    if (targetCards.length > 0) {
        return targetCards
    } else {
        throw createError({statusCode: 400, statusMessage: `No Cards found with given IDs.`})
    }
})