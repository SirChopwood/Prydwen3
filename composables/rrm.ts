import type {User, UserSessionComposable} from "#auth-utils";
import type {RRM_Session} from "~/server/utils/drizzle";
import {useUserSession} from "#build/imports";

export function useSessionManager() {
    return new RRM_Session_Manager
}

class RRM_Session_Manager {
    #userSession: UserSessionComposable | null = null
    #currentSession: Ref<RRM_Session | null> = ref(null)
    #sessionList: Ref<Array<RRM_Session>> = ref([])
    #currentSessionId: Ref<number | null> = ref(null)
    #requestList: Ref<Record<number, RRM_Request>> = ref([])
    timeSinceStart: Ref<{milliseconds: number, seconds: number, minutes: number, hours: number, text: string}> =
        ref({milliseconds: 0, seconds: 0, minutes: 0, hours: 0, text: "N/A"})

    constructor() {
        console.log("Rami Request Manager - Loading...")

        // Ensure we are authed with Twitch
        this.#userSession = useUserSession()
        if (this.isUserSessionValid()) {
            console.log("Logged into Twitch.")
        } else {
            console.log("Logged out of Twitch!")
        }

        // Ensure we can fetch data from the API
        this.refreshSessions().then(() => {
            console.log("Rami Request Manager - Ready...")
        })
    }

    async onMounted () {
        setInterval(this.refreshSessions.bind(this), 30*1000) // Update SessionList every 30s
        await this.refreshSessions()
        setInterval(this.refreshRequests.bind(this), 5*1000) // Update RequestList every 5s
        await this.refreshRequests()
        setInterval(this.refreshTimer.bind(this), 1000) // Update Timer every second
        this.refreshTimer()
        console.log("Rami Request Manager - Running!")
    }

    refreshTimer () {
        let time = {milliseconds: 0, seconds: 0, minutes: 0, hours: 0, text: "N/A"}
        if (this.#currentSession.value) {
            let sessionStartDate = new Date(this.#currentSession.value.startTime)
            time.milliseconds = Math.floor(Date.now() - sessionStartDate.getTime())
            time.seconds = Math.floor(time.milliseconds / 1000);
            time.minutes = Math.floor(time.seconds / 60);
            time.hours = Math.floor(time.minutes / 60);
            time.minutes = time.minutes - (time.hours * 60);
            time.seconds = time.seconds - (((time.hours * 60) + time.minutes) * 60)
            time.text = `${time.hours}h ${time.minutes}m ${time.seconds}s`
        }
        this.timeSinceStart.value = time
    }

    isUserSessionValid() {
        if (this.#userSession) {
            return this.#userSession.loggedIn.value
        } else {
            return false
        }
    }

    getUserSession() {
        if (this.#userSession) {
            return this.#userSession.user.value as User
        } else {
            return null
        }
    }

    clearUserSession() {
        if (this.#userSession) {
            this.#userSession.clear().then((result: any) => {
                console.log("Logged out of Twitch!")
                reloadNuxtApp()
            })
        }
    }

    async getModdedChannels () {
        let { data, status, error } = await useFetch("/api/v1/rrm/twitch/moderated", {method: "POST", body: JSON.stringify({})})
        console.log(data.value)
        if (status.value === "success" && data.value) {
            return data.value
        } else {
            console.log(error)
        }
    }

    getChannelSelectOptions () {
        let options: Array<{ value: string; label: string }> = []
        if (this.#currentSession.value && this.#currentSession.value.channels) {
            options.push({
                value: String(this.#currentSession.value.owner.id),
                label: String(this.#currentSession.value.owner.name)
            })
            for (let channel of this.#currentSession.value.channels) {
                options.push({
                    value: String(channel.id),
                    label: String(channel.name)
                })
            }
        }
        return options
    }

    async refreshSessions () {
        let { data, status, error } = await useFetch("/api/v1/rrm/session/fetch", {method: "POST", body: JSON.stringify({})})
        console.log(data.value)
        if (status.value === "success" && data.value) {
            this.#sessionList.value = data.value as Array<RRM_Session>
        } else {
            console.log(error)
        }
    }

    async getSessionsSelectOptions () {
        let options: Array<{ value: string; label: string }> = []
        if (this.#sessionList.value) {
            for (let session of this.#sessionList.value) {
                options.push({value: session.id.toString(), label: `[ ${session.id} ] - ${session.owner.name}`})
            }
        }
        return options
    }

    async setSession (sessionId: number) {
        this.#currentSessionId.value = sessionId
        console.log(`Session ID Updated to ${sessionId}.`)
        console.log(await this.getSession())
    }

    getSession () {
        if (this.#currentSession.value && this.#currentSession.value!.id === this.#currentSessionId.value) {
            return this.#currentSession.value
        } else {
            if (this.#currentSessionId.value && this.#sessionList.value.length > 0) {
                for (let session of this.#sessionList.value) {
                    if (session.id === this.#currentSessionId.value) {
                        this.#currentSession.value = session
                        return this.#currentSession.value
                    }
                }
            }
        }
    }

    async refreshRequests () {
        let { data, status, error } = await useFetch("/api/v1/rrm/request/fetch", {method: "POST", body: JSON.stringify({session: this.#currentSessionId.value})})
        console.log(data.value)
        if (status.value === "success" && data.value) {
            this.#requestList.value = data.value as Record<number, RRM_Request>
        } else {
            console.log(error)
        }
    }

    getRequestQueue () {
        let queue: Array<RRM_Request> = []
        if (this.#currentSession.value !== null && this.#requestList.value) {
            for (let index of this.#currentSession.value.requests) {
                queue.push(this.#requestList.value[index])
            }
        }
        return queue
    }
}