import {z} from "zod";

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, (body) => {
        return z.object({
            "hello": z.string()
        }).parse(body)
    })

    result["foo"] = "bar"
    return result
})