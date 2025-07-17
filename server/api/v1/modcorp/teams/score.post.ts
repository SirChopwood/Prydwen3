import {validateRequest} from "~/server/utils/api";
import {editScore as schema} from "~/server/schema/modcorp/teams";
import {tables, useDrizzle} from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    if (context.body.token !== process.env.MODCORP_TOKEN) {
        throw createError({statusCode: 400, statusMessage: `Invalid token.`})
    }

    let db = useDrizzle()
    let targetTeam
    try {
        targetTeam = await db.query.ModCorp_Team.findFirst({
            where: (team, {eq}) => {
                return eq(team.id, context.body.id)
            }
        })
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to fetch Team.`})
    }
    if (!targetTeam) {
        throw createError({statusCode: 400, statusMessage: `Team ID Invalid.`})
    }
    let newScore = targetTeam.score + context.body.score

    try {
        let result = await db.update(tables.ModCorp_Team)
            .set({score: newScore})
            .where(eq(tables.ModCorp_Team.id, context.body.id))
            .returning()
        await db.insert(tables.ModCorp_Logs).values({
            "user_name": context.body.user_name,
            "user_id": context.body.user_id,
            "action": `Adjusted [${targetTeam.id}] ${targetTeam.name}'s score by ${context.body.score} to a total of ${newScore}`,
            "reason": context.body.reason,
            "timestamp": new Date().toISOString()
        })
        return result
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to update Score.`})
    }
})