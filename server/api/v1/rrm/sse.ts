import {fetchUserSession} from "~/server/utils/api";

export default defineEventHandler(async (event) => {
    const eventStream = createEventStream(event)

    const updateTimer = setInterval(async () => {
        const userSession = await fetchUserSession(event)
        let selectedSession = await useStorage().getItem<number|null>(`${userSession.user?.id}-selectedSession`)
        if (selectedSession) {
            await eventStream.push("REQUEST-"+JSON.stringify(
                await $fetch("/api/v1/rrm/request/fetch", {
                    method: "POST",
                    body: JSON.stringify({
                        sessionId: selectedSession
                    })
                })
            ))
            await eventStream.push("SESSION-"+JSON.stringify(
                await fetchSessionById(selectedSession)
            ))
        }
    }, 1000)

    eventStream.onClosed(async () => {
        console.log(`[SSE] Disconnected from stream.`)
        clearInterval(updateTimer)
        await eventStream.close()
    })

    if (await requireUserSession(event)) {
        console.log(`[SSE] Stream started.`)
        return eventStream.send()
    } else {
        throw createError({statusCode: 401, statusMessage: "[SSE] User is not authenticated."})
    }
})