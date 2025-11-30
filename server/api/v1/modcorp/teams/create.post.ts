import {tables, useDrizzle} from "~/server/utils/drizzle";
import {validateRequest} from "~/server/utils/api";
import {createTeam as schema} from "~/server/schema/modcorp/teams";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, schema)
    if (context.body.token !== process.env.MODCORP_TOKEN) {
        throw createError({statusCode: 400, statusMessage: `Invalid token.`})
    }


    let db = useDrizzle()

    try {
        let newTeam = await db.insert(tables.ModCorp_Team).values({
            "name": context.body.name,
            "description": context.body.description,
            "colour": context.body.colour,
            "logo_url": context.body.logo_url,
            "discord": context.body.discord,
        }).returning()
        if (newTeam) {
            await db.insert(tables.ModCorp_Logs).values({
                "user_name": context.body.user_name,
                "user_id": context.body.user_id,
                "action": `Created team [${newTeam[0].id}] ${newTeam[0].name}.`,
                "reason": null,
                "timestamp": new Date().toISOString()
            })
            return newTeam
        } else {
            throw createError({statusCode: 400, statusMessage: `Failed to create Team.`})
        }
    } catch (error) {
        console.log(error)
        throw createError({statusCode: 400, statusMessage: `Failed to create Team.`})
    }
})


