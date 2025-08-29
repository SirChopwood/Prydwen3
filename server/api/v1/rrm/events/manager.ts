import {fetchUserSession, fetchUserSessionSafe} from "~/server/utils/api";

let updateTimer: NodeJS.Timeout | null = null;

export default defineWebSocketHandler({
    async upgrade(request) {
        // @ts-ignore
        if (await fetchUserSessionSafe(request)) {
            console.log(`[WS] Socket Upgraded`)
        } else {
            console.log(`[WS] Socket Declined - Unauthorised`)
            return new Response("Unauthorized", {
                status: 401,
                headers: {
                    "WWW-Authenticate":
                        'Basic realm="Websocket Authentication", charset="UTF-8"',
                },
            });
        }
    },
    async open(peer) {
        console.log(`[WS] Socket Opened`);
        updateTimer = setInterval(async () => {
            // @ts-ignore
            const userSession = await fetchUserSession(peer)
            let selectedSession = await useStorage().getItem<number|null>(`${userSession.user?.id}-selectedSession`)
            if (selectedSession) {
                peer.send({ type: "Requests",
                    data: await $fetch("/api/v1/rrm/request/fetch", {
                        method: "POST",
                        body: JSON.stringify({
                            sessionId: selectedSession
                        })
                    })
                })
                peer.send({ type: "Session",
                    data: await $fetch("/api/v1/rrm/session/fetch", {
                        method: "POST",
                        body: JSON.stringify({
                            sessionId: selectedSession
                        })
                    })
                })
            }
        }, 1000)
    },
    async message(peer, message) {
        let {type, data} = message.json() as {type: string, data: any}
        console.log(`[WS] Message Received: Type "${type}"`);
        switch (type) {
            case "Ping":
                peer.send({ type: "Pong", data: data})
                break;
            case "Position":
                // @ts-ignore
                const userSession = await fetchUserSession(peer)
                let selectedSession = await useStorage().getItem<number|null>(`${userSession.user?.id}-selectedSession`)
                if (selectedSession) {
                    await $fetch("/api/v1/rrm/session/position", {method: "POST", body: JSON.stringify({
                        sessionId: selectedSession,
                        newPosition: data.value
                    })})
                }
                break
        }
    },
    async error(peer, error) {
        console.log(`[WS] Error`);
    },
    async close(peer) {
        console.log(`[WS] Socket Closed: ${peer.remoteAddress}`)
        clearInterval(updateTimer!)
    }
})