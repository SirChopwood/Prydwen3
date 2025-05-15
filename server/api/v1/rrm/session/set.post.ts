import {validateRequest} from "~/server/utils/api";
import {setSession} from "~/server/schema/rrm/session";

export default defineEventHandler(async (event) => {
    const context = await validateRequest(event, setSession, true)
    await useStorage().setItem<number|null>(`${context.userSession.user?.id}-selectedSession`, context.body.sessionId)
    return `Session ID Set to ${context.body.sessionId}`
})