import {validateRequest} from "~/server/utils/api";
import {fetchBanner as schema} from "~/server/schema/modcorp/cards";
import {useDrizzle} from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    let db = useDrizzle()
    let targetBanner
    try {
        targetBanner = await db.query.ModCorp_Banners.findFirst({
            where: (banner, {eq}) => {
                return eq(banner.id, Number(context.body.banner_id))
            }
        })
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to fetch Banner.`})
    }
    if (targetBanner) {
        if (targetBanner.contents.length > 0) {
            // @ts-ignore
            targetBanner.cardData = await $fetch("/api/v1/modcorp/cards/card/fetch", {
                method: "POST",
                body: JSON.stringify({card_ids: targetBanner.contents}),
            })
        } else {
            // @ts-ignore
            targetBanner.cardData = []
        }
        return targetBanner
    } else {
        throw createError({statusCode: 400, statusMessage: `No Banner found with that ID.`})
    }
})