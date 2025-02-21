import {z} from "zod";
import {getChannel} from "~/server/utils/rrm/session";
import {useDrizzle} from "#imports";
import { RRM_TwitchChannel } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
    const result: any = await readValidatedBody(event, (body) => {
        return z.object({
            "id": z.string(),
            "name": z.string(),
            "add": z.boolean().default(false)
        }).parse(body)
    })

    try {
        let db = useDrizzle()

        if (result.add) {
            await db.insert(RRM_TwitchChannel).values({
                id: Number(result.id),
                name: result.name
            })
            result.channel = await getChannel(result)
            result.added = true
        } else {
            result.channel = await getChannel(result)
        }
    } catch (e) {
        console.log(e)
    }
    return result
})