import {validateRequest} from "~/server/utils/api";
import {Card, DBCard, fetchCards as schema} from "~/server/schema/modcorp/cards";
import {useDrizzle} from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    let db = useDrizzle()

    let totalCards: Record<number, DBCard> = {}
    const chunkSize = 50
    for (let i = 0; i < context.body.card_ids.length; i += chunkSize) { // Makes requests to DB in 50 item increments due to SQLite limits
        const cardIdsChunk = context.body.card_ids.slice(i, i + chunkSize)
        try {
            let cardsChunk = await db.query.ModCorp_Cards.findMany({
                where: (card, {inArray}) => {
                    return inArray(card.id, cardIdsChunk)
                }
            })
            for (let card of cardsChunk) {
                if (!Object.keys(totalCards).includes(String(card.id))) {
                    totalCards[card.id] = card
                }
            }
        } catch (error) {
            console.log(error)
            throw createError({statusCode: 400, statusMessage: `Failed to fetch Cards.`})
        }
    }
    if (Object.keys(totalCards).length > 0) {
        return totalCards
    } else {
        throw createError({statusCode: 400, statusMessage: `No Cards found with given IDs.`})
    }
})