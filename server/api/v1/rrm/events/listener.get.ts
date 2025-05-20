export default defineEventHandler(async (event) => {
    const eventStream = createEventStream(event)

    const eventTimer = setInterval(async () => {
        const session = await useSession(event, {name: "RRM-Overlay", password: process.env.NUXT_SESSION_PASSWORD!})
        if (session.data.targetChannel) {
            let rrm_session = await $fetch("/api/v1/rrm/session/fetch", {
                method: "POST",
                body: JSON.stringify({
                    channel: {
                        name: session.data.targetChannel.name,
                        id: Number(session.data.targetChannel.id)
                    }
                })
            })
            if (rrm_session.length > 0) {
                await eventStream.push(JSON.stringify({ type: "Session",
                    data: rrm_session[0]
                }))
                await eventStream.push(JSON.stringify({ type: "Requests",
                    data: await $fetch("/api/v1/rrm/request/fetch", {
                        method: "POST",
                        body: JSON.stringify({
                            sessionId: rrm_session[0].id
                        })
                    })
                }))
            }
        }
    }, 1000)
    eventStream.onClosed(async () => {
        clearInterval(eventTimer!)
        await eventStream.close()
        console.log(`[SSE] Stream Closed`)
    })

    console.log(`[SSE] Stream Opened`)
    return eventStream.send()
})