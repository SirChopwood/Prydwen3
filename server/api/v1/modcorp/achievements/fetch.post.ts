import {validateRequest} from "~/server/utils/api";
import {fetchAchievement as schema} from "~/server/schema/modcorp/achievements";
import {useDrizzle} from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    let db = useDrizzle()
    try {
        let targetAchievement = await db.query.ModCorp_Achievements.findFirst({
            where: (achievement, {eq}) => {
                return eq(achievement.id, context.body.id!)
            }
        })
        if (targetAchievement) {
            return targetAchievement
        } else {
            throw createError({statusCode: 400, statusMessage: `Achievement ID Invalid.`})
        }
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to fetch Achievement.`})
    }
})