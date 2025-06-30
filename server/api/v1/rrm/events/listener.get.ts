// export default defineEventHandler(async (event) => {
//     const eventStream = createEventStream(event)
//
//     const eventTimer = setInterval(async () => {
//         const session = await useSession(event, {name: "RRM-Overlay", password: process.env.NUXT_SESSION_PASSWORD!})
//         if (session.data.targetChannel) {
//             let rrm_session = await $fetch("/api/v1/rrm/session/fetch", {
//                 method: "POST",
//                 body: JSON.stringify({
//                     channel: {
//                         name: session.data.targetChannel.name,
//                         id: Number(session.data.targetChannel.id)
//                     }
//                 })
//             })
//             if (rrm_session.length > 0) {
//                 await eventStream.push(JSON.stringify({ type: "Session",
//                     data: rrm_session[0]
//                 }))
//                 await eventStream.push(JSON.stringify({ type: "Requests",
//                     data: await $fetch("/api/v1/rrm/request/fetch", {
//                         method: "POST",
//                         body: JSON.stringify({
//                             sessionId: rrm_session[0].id
//                         })
//                     })
//                 }))
//             }
//         }
//     }, 1000)
//     eventStream.onClosed(async () => {
//         clearInterval(eventTimer!)
//         await eventStream.close()
//         console.log(`[SSE] Stream Closed`)
//     })
//
//     console.log(`[SSE] Stream Opened`)
//     return eventStream.send()
// })

import {fetchChannelInfo} from "~/server/utils/rrm/twitch";

let updateTimer: NodeJS.Timeout | null = null;
let targetChannel: {name: string, id: number} | null = null

export default defineWebSocketHandler({
    async upgrade(request) {
        console.log(`[WS] Socket Upgraded`)
    },
    async open(peer) {
        console.log(`[WS] Socket Opened`);

        updateTimer = setInterval(async () => {
            if (targetChannel) {
                let rrm_session = await $fetch("/api/v1/rrm/session/fetch", {
                    method: "POST",
                    body: JSON.stringify({
                        channel: {
                            name: targetChannel.name,
                            id: Number(targetChannel.id)
                        }
                    })
                })
                if (rrm_session.length > 0) {

                    peer.send({ type: "Session",
                        data: rrm_session[0]
                    })
                    peer.send({ type: "Requests",
                        data: await $fetch("/api/v1/rrm/request/fetch", {
                            method: "POST",
                            body: JSON.stringify({
                                sessionId: rrm_session[0].id
                            })
                        })
                    })
                }
            }
        }, 1000)
    },
    async message(peer, message) {
        let {type, data} = message.json() as {type: string, data: any}
        console.log(`[WS] Message Received: Type "${type}"`);
        if (type === "Target") {
            console.log(JSON.stringify(data))
            let channelInfo = await fetchChannelInfo({name: data.channelName})
            console.log(JSON.stringify(channelInfo))
            if (channelInfo) {
                targetChannel = {name : channelInfo.display_name, id: channelInfo.id}
                console.log(`Channel set to: ${targetChannel}`)
            }
        }
    },
    async error(peer, error) {
        console.log(`[WS] Error: ${error}`);
    },
    async close(peer) {
        console.log(`[WS] Socket Closed: ${peer.remoteAddress}`)
        clearInterval(updateTimer!)
    }
})