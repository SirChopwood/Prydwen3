import {validateRequest} from "~/server/utils/api";
import {fetchTeam as schema} from "~/server/schema/modcorp/teams";
import {useDrizzle} from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    let db = useDrizzle()
    try {
        let targetTeam = await db.query.ModCorp_Team.findFirst({
            where: (team, {eq}) => {
                return eq(team.id, context.body.id)
            }
        })
        if (targetTeam) {
            return targetTeam
        } else {
            throw createError({statusCode: 400, statusMessage: `Team ID Invalid.`})
        }
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to fetch Team.`})
    }
})