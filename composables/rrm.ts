import type {UserSessionComposable} from "#auth-utils";
import type {RRM_Session, RRM_Request} from "~/server/utils/drizzle";
import {useUserSession} from "#imports";

// REQUEST MANAGER FOR PANEL

export function useRequestManager() {
    return new RRM_Request_Manager
}

export type RequestManager = InstanceType<typeof RRM_Request_Manager>

export enum SessionStatus {
    Open = "Open",
    Locked = "Locked",
    Closed = "Closed"
}

class RRM_Request_Manager {
    private webSocket: WebSocket | null = null
    private webSocketRefreshTimer: ReturnType<typeof setTimeout> | null = null
    private userSession: UserSessionComposable | null = null
    private moddedChannels: Ref<Array<{id: number, name: string}> | null> = ref(null)
    private sessionList: Ref<Record<number, RRM_Session>> = ref({})
    private currentSessionId: Ref<number> = ref(0)
    private requestList: Ref<Record<number, RRM_Request>> = ref({})
    refreshTimerPaused: Ref<boolean> = ref(true)
    uptime: Ref<string> = ref("N/A")
    pingInterval: Ref<string> = ref("N/A")
    hostName: Ref<string> = ref(localStorage.getItem("hostName") || "")

    constructor() {
        console.log("Rami Request Manager 1.3 - Loading...")
        this.userSession = useUserSession()
        console.log(`Client is logged ${this.getUserSessionValid ? "into" : "out of"} Twitch`)

        watch(this.hostName, (newName, oldName) => {
            if (newName === "") {
                localStorage.removeItem("hostName")
            } else {
                localStorage.setItem("hostName", newName);
            }
        })
    }

    /**
     * Should be run once when the onMounted event fires on owning page, allowing for any runtime setup.
     */
    async onMounted () {
        console.log("Rami Request Manager - Mounted")

        await this.refreshModdedChannels()
        console.log(`Rami Request Manager - Logged in, moderating for channels: ${JSON.stringify(this.moddedChannels.value)}`)

        setTimeout(async () => {
            await this.refreshSessions()
            await $fetch("/api/v1/rrm/session/set", {method: "POST", body: {"sessionId": null}})
        }, 100)
        console.log("Rami Request Manager - Sessions Refresh Queued.")

        if (this.reloadWebSocket()) {
            console.log("Rami Request Manager - WebSocket Connected")
        }

        this.refreshUptime()
        setInterval(this.refreshUptime.bind(this), 1000) // Update Timer every second
        setInterval(this.heartbeatPing.bind(this), 5000)
        setInterval(this.updateData.bind(this), 2000)
        setInterval(this.refreshSessions.bind(this), 30000)

        console.log("Rami Request Manager - Internal Timer Setup")

        this.refreshTimerPaused.value = false
        console.log("Rami Request Manager - Running! :3")
    }

    /**
     * Closes the connection when unmounting to prevent duplciate listeners.
     */
    async onUnmounted () {
        console.log("Rami Request Manager - Unmounting")
        if (this.webSocketRefreshTimer) {
            clearTimeout(this.webSocketRefreshTimer)
        }
        if (this.webSocket) {
            this.webSocket.close()
        }
        console.log("Rami Request Manager - Goodbye! :3")
    }

    /**
     * Creates a new WebSocket, closing the active one if needed and setting the auto-refresh.
     */
    reloadWebSocket () {
        if (this.webSocket) {
            this.webSocket.close()
            console.log(`[SSE] Connection closed: ${this.webSocket.url}`)
        }

        this.webSocket = new WebSocket("/api/v1/rrm/events/manager")

        if (this.webSocket === null) {
            console.log("Rami Request Manager - Failed to connect to WebSocket")
            return false
        } else {
            this.webSocket.onopen = () => {
                console.log(`[WS] Connected to ${this.webSocket!.url}`)
            }

            this.webSocket.onmessage = async (event) => {
                let {type, data} = JSON.parse(event.data)
                console.log(`[WS] Message Received: Type "${type}"`);
                await this.handleWebsocketMessage(event, type, data)
            }

            this.webSocket.onerror = (event) => {
                console.log(`[WS] Error from ${this.webSocket!.url} - ${event.type}`)
            }

            this.webSocketRefreshTimer = setTimeout(this.reloadWebSocket.bind(this), 1000*60*5)
            return true
        }
    }

    async handleWebsocketMessage (event: MessageEvent<any>, type: string, data: any) {
        if (type === "Session") {
            this.sessionList.value[data.id] = data as RRM_Session
        } else if (type === "Requests") {
            let newList: Record<number, RRM_Request> = {}
            for (let request of data as Array<RRM_Request>) {
                newList[request.id] = request
            }
            this.requestList.value = newList
        } else if (type === "Pong") {
            this.updatePing(data)
        }
    }

    // USER SESSION
    /**
     * Check if the current session has a valid login.
     */
    get getUserSessionValid () {
        if (this.userSession?.user.value) {
            return Boolean(this.userSession?.user.value)
        }
        return false
    }

    /**
     * Gets the user's current login session.
     */
    get getUserSession () {
        return this.userSession
    }

    /**
     * Clears out the current UserSession, functionally logging the user out.
     */
    async clearUserSession () {
        if (this.userSession) {
            this.userSession.clear().then((result: any) => {
                console.log("Logged out of Twitch!")
                reloadNuxtApp()
            })
        }
    }

    /**
     * @returns {String} Gets the profile of the logged-in user.
     */
    get getUserProfile () {
        if (this.getUserSessionValid !== null) {
            return this.userSession!.user.value
        }
    }


    // TWITCH API
    /**
     * Fetches all channels the user is Moderator in on Twitch and updates the internal cache.
     * Use {@link this.getModdedChannels} to get them.
     */
    async refreshModdedChannels () {
        let { data, status, error } = await useFetch("/api/v1/rrm/twitch/moderated", {method: "POST", body: JSON.stringify({})})
        if (status.value === "success" && data.value) {
            this.moddedChannels.value = data.value
        } else {
            console.log(error)
        }
    }

    /**
     * @returns {Array<{id: number, name: string}} Gets all channels the user is Moderator in on Twitch.
     */
    get getModdedChannels () {
        return this.moddedChannels.value
    }


    // RRM SESSION
    /**
     * Fetches all currently active sessions the user is a moderator for.
     */
    async refreshSessions (force = false) {
        let ping = Date.now()
        let { data, status, error } = await useFetch("/api/v1/rrm/session/fetch", {method: "POST", body: JSON.stringify({force: force})})
        this.updatePing(ping, status.value !== "success")

        if (status.value === "success" && data.value) {
            let newList: Record<number, RRM_Session> = {}
            for (let session of data.value as Array<RRM_Session>) {
                newList[session.id] = session
            }
            this.sessionList.value = newList
            return
        } else {
            console.log(error.value)
            return
        }
    }

    /**
     * @returns {Array<RRM_Session>} Gets all currently active Sessions.
     */
    get getActiveSessions () {
        return this.sessionList.value
    }

    /**
     * @returns {RRM_Session} Gets the currently selected session.
     */
    get getCurrentSession () {
        return this.sessionList.value[this.currentSessionId.value]
    }

    /**
     * @returns {Array<{ value: string; label: string }>} Gets the Select Options for all Active Sessions.
     */
    get getActiveSessionOptions () {
        let options: Array<{ value: string; label: string }> = []
        if (this.sessionList.value) {
            for (let session of Object.values(this.sessionList.value)) {
                if (session.id && session.owner) {
                    options.push({value: session.id.toString(), label: `[ ${session.id} ] - ${session.owner.name}`})
                }
            }
        }
        return options
    }

    /**
     * Sets the current session.
     * @param value The ID of the session you want to select.
     */
    async setCurrentSession (value: number) {
        if (Object.keys(this.sessionList.value).includes(String(value))) {
            this.currentSessionId.value = value
            await $fetch("/api/v1/rrm/session/set", {method: "POST", body: JSON.stringify({sessionId: value})})
            console.log(`Current Session ID is set to ${value}`)
        }
    }

    /**
     * @returns {Array<{ value: string; label: string }>} Gets the Channel Options for the Current Session.
     */
    get getCurrentSessionChannelOptions () {
        let options: Array<{ value: string; label: string }> = []
        let currentSession = this.getCurrentSession
        if (currentSession && currentSession.channels.length > 0) {
            options.push({
                value: String(currentSession.owner.name),
                label: String(currentSession.owner.name)
            })
            for (let channel of currentSession.channels) {
                options.push({
                    value: String(channel.name),
                    label: String(channel.name)
                })
            }
        }
        return options
    }


    // RRM REQUESTS
    /**
     * Refreshes the list of requests that are currently open and accessable to the user.
     */
    async refreshRequests () {
        if (this.refreshTimerPaused.value) {return}
        let ping = Date.now()
        let { data, status, error } = await useFetch("/api/v1/rrm/request/fetch", {method: "POST", body: JSON.stringify({session: this.currentSessionId.value})})
        this.updatePing(ping, status.value !== "success")

        if (status.value === "success" && data.value) {
            let newList: Record<number, RRM_Request> = {}
            for (let request of data.value) {
                newList[request.id] = request
            }
            this.requestList.value = newList
            return
        } else {
            console.log(error)
            return
        }
    }

    /**
     * @returns {Array<RRM_Request>} The request array sorted by their ID.
     */
    get getRequestsByID () {
        return this.requestList.value
    }

    /**
     * @returns {Array<RRM_Request>} The request array sorted by their order in the Session.
     */
    get getRequestsByOrder () {
        if (this.getCurrentSession) {
            let orderedRequests = [] as Array<RRM_Request>
            for (let index of this.getCurrentSession.requests) {
                if (this.requestList.value[index]){
                    orderedRequests.push(this.requestList.value[index])
                }
            }
            return orderedRequests
        }
        return
    }

    // MISC
    private refreshUptime () {
        let time = {milliseconds: 0, seconds: 0, minutes: 0, hours: 0, text: "N/A"}
        if (this.getCurrentSession) {
            let sessionStartDate = new Date(this.getCurrentSession.startTime)
            time.milliseconds = Math.floor(Date.now() - sessionStartDate.getTime())
            time.seconds = Math.floor(time.milliseconds / 1000);
            time.minutes = Math.floor(time.seconds / 60);
            time.hours = Math.floor(time.minutes / 60);
            time.minutes = time.minutes - (time.hours * 60);
            time.seconds = time.seconds - (((time.hours * 60) + time.minutes) * 60)
            time.text = `${time.hours}h ${time.minutes}m ${time.seconds}s`
        }
        this.uptime.value = time.text
    }

    get getUptime () {
        return this.uptime.value
    }

    private async heartbeatPing () {
        if (this.refreshTimerPaused.value) {return}
        if (this.webSocket) {
            let ping = Date.now()
            this.webSocket.send(JSON.stringify({ type: "Ping", data: ping }))
        }
    }

    private async updateData () {
        if (this.webSocket) {
            if (this.currentSessionId.value !== 0) {
                this.webSocket.send(JSON.stringify({type: "Update", data: {sessionId: this.currentSessionId.value}}))
            }
        }
    }

    private updatePing (startTime: number, failed = false) {
        if (failed) {
            this.pingInterval.value = "N/A"
        } else {
            this.pingInterval.value = `${Date.now() - startTime}ms`
        }
    }

    async setCurrentRequest (value: number) {
        if (this.getCurrentSession && this.webSocket) {
            if (value < 0 && value > Object.keys(this.requestList.value).length) {
                return false
            }
            this.webSocket.send(JSON.stringify({ type: "Position", data: {sessionId: this.currentSessionId.value, position: value, user: this.hostName.value} }))
            await this.refreshSessions()
            console.log(`Current Request set to ${value}`)
            return true
        }
    }

    get getCurrentRequest () {
        return this.getCurrentSession ? this.getCurrentSession.currentRequest : 0
    }

    async setCurrentStatus (value: SessionStatus) {
        if (this.getCurrentSession && this.webSocket) {
            this.webSocket.send(JSON.stringify({
                type: "Status",
                data: {sessionId: this.currentSessionId.value, status: value, user: this.hostName.value}
            }))
            await this.refreshSessions()
            console.log(`Current Status set to ${value}`)
            if (value === SessionStatus.Closed) {
                this.currentSessionId.value = 0
            }
            return true
        }
    }

    get getCurrentStatus () {
        return this.getCurrentSession ? this.getCurrentSession.status : ""
    }
}

// REQUEST LISTENER FOR OVERLAYS

export function useRequestListener() {
    return new RRM_Request_Listener()
}

export type RequestListener = InstanceType<typeof RRM_Request_Listener>

class RRM_Request_Listener {
    private webSocket: WebSocket | null = null
    private webSocketRefreshTimer: ReturnType<typeof setTimeout> | null = null
    private session: Ref<RRM_Session | null> = ref(null)
    private requests: Ref<Record<number, RRM_Request>> = ref({})
    channel: Ref<string | null> = ref(null)
    route = useRoute()

    constructor() {
        console.log("Rami Request Listener 1.3 - Loading...")
    }

    /**
     * Should be run once when the onMounted event fires on owning page, allowing for any runtime setup.
     */
    async onMounted () {
        console.log("Rami Request Listener - Mounted")

        if (Array.isArray(this.route.params.twitchName)) {
            this.channel.value = this.route.params.twitchName[0]
        } else {
            this.channel.value = this.route.params.twitchName
        }
        console.log(`Rami Request Listener - Searching for Channel: ${this.channel.value}`)

        if (this.reloadListener()) {
            console.log("Rami Request Listener - Event Listener Connecting...")
        } else {
            console.log("Rami Request Listener - Failed to Connect.")
        }
    }

    /**
     * Closes the connection when unmounting to prevent duplciate listeners.
     */
    async onUnmounted () {
        console.log("Rami Request Listener - Unmounting")
        if (this.webSocketRefreshTimer) {
            clearTimeout(this.webSocketRefreshTimer)
        }
        if (this.webSocket) {
            this.webSocket!.close()
        }
        console.log("Rami Request Listener - Goodbye! :3")
    }

    /**
     * Attempts to reconnect the listener x number of times before giving up.
     */
    reloadListener (attempts: number = 3) {
        console.log("Attempting to reload listener.")
        for (let i = 0; i < attempts; i++){
            if (this.attemptConnection()) {
                return true
            }
        }
        console.log(`Maximum Attempts (${attempts}) failed, stopping.`)
        return false
    }

    /**
     * Creates a new SSE Listener, closing the active one if needed and setting the auto-refresh.
     */
    attemptConnection () {
        if (this.webSocket) {
            console.log("Existing socket open, restarting...")
            this.webSocket.close()
        }
        this.webSocket = new WebSocket("/api/v1/rrm/events/listener")
        if (this.webSocket) {
            this.webSocket.addEventListener("open", (event) => {
                console.log(`[WS] Connected to ${this.webSocket!.url}`)
                this.webSocket!.send(JSON.stringify({
                    type: "Target",
                    data: {
                        channelName: this.channel.value
                    }
                }))
                console.log("[WS] Target Request Sent")
            })

            this.webSocket.addEventListener("message", (event) => {
                let {type, data} = JSON.parse(event.data)
                console.debug(`[WS] Message Received: Type "${type}"`);

                if (type === "Session") {
                    this.session.value = data as RRM_Session
                } else if (type === "Requests") {
                    let newList: Record<number, RRM_Request> = {}
                    for (let request of data as Array<RRM_Request>) {
                        newList[request.id] = request
                    }
                    this.requests.value = newList
                } else if (type === "TargetConfirm") {
                    console.log(`[WS] Target Received: ${JSON.stringify({data})}`)
                }
            })

            this.webSocket.addEventListener("close", (event) => {
                console.log(`[WS] Connection closed: ${event.reason}`)
            })

            this.webSocket.addEventListener("error", (event) => {
                console.log(`[WS] Error: ${event}`)
            })

            this.webSocketRefreshTimer = setTimeout(this.reloadListener.bind(this), 1000*30) // Need to fix issues so this can go up.
            return true
        } else {
            console.log("[WS] Failed to connect!")
            return false
        }
    }

    /**
     * @returns {Array<RRM_Request>} The request array sorted by their order in the Session.
     */
    get getRequestsByOrder () {
        let orderedRequests = [] as Array<RRM_Request>
        if (this.session.value) {
            for (let index of this.session.value.requests) {
                if (this.requests.value[index]){
                    orderedRequests.push(this.requests.value[index])
                }
            }
        }
        return orderedRequests
    }

    get getCurrentRequest () {
        return this.session.value ? this.session.value.currentRequest : 0
    }

    get getSessionStatus () {
        return this.session.value?.status
    }

    get getHost () {
        return this.session.value?.lastUser
    }
}