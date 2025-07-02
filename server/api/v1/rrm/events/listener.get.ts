import {fetchChannelInfo} from "~/server/utils/rrm/twitch";
import {Peer} from "crossws";

let updateTimer: NodeJS.Timeout | null = null;
let targetChannel: {name: string, id: number} | null = null

export default defineWebSocketHandler({
    async upgrade(request) {
        console.log(`[WebSocket] Socket Upgraded`)
    },
    async open(peer) {
        console.log(`[WebSocket] Socket Opened`);
        peer.subscribe(`${peer.id}`)
    },
    async message(peer, message) {
        let {type, data} = message.json() as {type: string, data: any}
        console.log(`[WebSocket] Message Received: Type "${type}"`);
        if (type === "Target") {
            console.log(JSON.stringify(data))
            let channelInfo = await fetchChannelInfo(
                {
                    name: data.channelName
                },
                process.env.NUXT_OAUTH_TWITCH_CLIENT_ID,
                process.env.NUXT_OAUTH_TWITCH_CLIENT_SECRET
            )
            console.log(JSON.stringify(channelInfo))
            if (channelInfo) {
                targetChannel = {
                    name : channelInfo.display_name,
                    id: channelInfo.id
                }
                console.log(`Channel set to: ${targetChannel}`)

                if (updateTimer) {
                    clearInterval(updateTimer)
                }
                updateTimer = setInterval(sendUpdate, 1000, peer)
            }
        }
    },
    async error(peer, error) {
        console.log(`[WebSocket] Error: ${error}`);
    },
    async close(peer) {
        console.log(`[WebSocket] Socket Closed: ${peer.remoteAddress}`)
        peer.unsubscribe(`${peer.id}`)
        clearInterval(updateTimer!)
    }
})

async function sendUpdate(peer: Peer) {
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
            peer.publish(`${peer.id}`, { type: "Session",
                data: rrm_session[0]
            })
            peer.publish(`${peer.id}`,{ type: "Requests",
                data: await $fetch("/api/v1/rrm/request/fetch", {
                    method: "POST",
                    body: JSON.stringify({
                        sessionId: rrm_session[0].id
                    })
                })
            })
        }
    }
}