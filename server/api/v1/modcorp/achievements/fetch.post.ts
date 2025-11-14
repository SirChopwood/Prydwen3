import {validateRequest} from "~/server/utils/api";
import {fetchAchievement as schema} from "~/server/schema/modcorp/achievements";
import {useDrizzle} from "~/server/utils/drizzle";
import {ModCorp_Achievements} from "~/server/database/schema";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    let db = useDrizzle()
    if (context.body.id) {
        try {
            let targetAchievement = await db.query.ModCorp_Achievements.findFirst({
                where: (achievement, {eq}) => {
                    return eq(achievement.id, context.body.id!)
                }
            })
            if (targetAchievement) {
                return [targetAchievement]
            } else {
                throw createError({statusCode: 400, statusMessage: `Achievement ID Invalid.`})
            }
        } catch (error) {
            console.log(error)
            throw createError({statusCode: 400, statusMessage: `Failed to fetch Achievement.`})
        }
    } else if (context.body.all) {
        try {
            let achievements = await db.select().from(ModCorp_Achievements)
            return achievements
        } catch (error) {
            console.log(error)
            throw createError({statusCode: 400, statusMessage: `Failed to fetch all Achievements.`})
        }
    }

})