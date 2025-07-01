export default defineWebSocketHandler({
    async upgrade(request) {
        console.log(`[WS] Test Socket Upgraded.`)
    },
    async open(peer) {
        console.log(`[WS] Test Socket Opened.`);
    },
    async message(peer, message) {
        console.log(`[WS] Test Socket Message: ${message.text()}`);
        if (message.text() === "first") {
            peer.send("A")
            setInterval(async () => {
                peer.send("B")
            }, 1000)
        }
    },
    async error(peer, error) {
        console.log(`[WS] Test Socket Error: ${error}`);
    },
    async close(peer) {
        console.log(`[WS] Test Socket Closed.`)
    }
})