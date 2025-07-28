import {validateRequest} from "~/server/utils/api";
import {card, cardRarity, redeemRoll as schema} from "~/server/schema/modcorp/cards";
import {tables, useDrizzle} from "~/server/utils/drizzle";
import {ModCorp_Cards} from "~/server/database/schema";
import randomWeightedChoice from "~/server/utils/rng";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    let db = useDrizzle()
    try {
        let targetUser = await db.query.ModCorp_UserCards.findFirst({
            where: (user, {eq}) => {
                return eq(user.user_id, Number(context.body.user_id))
            }
        })
        let targetBanner = await db.query.ModCorp_Banners.findFirst({
            where: (banner, {eq}) => {
                return eq(banner.id, Number(context.body.banner_id))
            }
        })

        if (targetUser && targetBanner) {
            if (!targetBanner.active) {
                throw createError({statusCode: 400, statusMessage: `Banner is not active.`})
            } else if (targetUser.rolls === 0) {
                throw createError({statusCode: 400, statusMessage: `No Rolls Remaining.`})
            } else {
                let allCards = await db.query.ModCorp_Cards.findMany({
                    where: (card, {inArray}) => {
                        return inArray(card.id, targetBanner.contents)
                    }
                })
                const cardWeights: Array<{weight: number, value: string}> = []
                allCards.forEach((card, index) => {
                    cardWeights.push({weight: cardRarity[card.rarity].chances, value: String(index)})
                })
                const selectedIndex = randomWeightedChoice(cardWeights)
                if (selectedIndex !== undefined && selectedIndex !== null) {
                    const selectedCard = allCards[Number(selectedIndex)]
                    targetUser.cards.push(Number(selectedIndex))
                    let result = await db.update(tables.ModCorp_UserCards)
                        .set({cards: targetUser.cards})
                        .where(eq(tables.ModCorp_UserCards.user_id, Number(context.body.user_id)))
                        .returning()
                    if (result && result.length > 0) {
                        await db.insert(tables.ModCorp_Logs).values({
                            "user_name": context.body.user_name,
                            "user_id": context.body.user_id,
                            "action": `Rolled the card [${selectedIndex}] ${selectedCard.name} (${selectedCard.rarity}).`,
                            "reason": null,
                            "timestamp": new Date().toISOString()
                        })
                        return result
                    } else {
                        throw createError({statusCode: 400, statusMessage: `Failed to save new card.`})
                    }
                }
            }
        } else {
            throw createError({statusCode: 400, statusMessage: `User Discord ID Invalid.`})
        }
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to fetch User and/or Banner.`})
    }
})