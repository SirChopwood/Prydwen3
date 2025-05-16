import type {RequestManager} from "~/composables/rrm";
import {createApp} from "vue";

export function useModalManager(RequestManager: RequestManager) {
    return new Modal_Manager(RequestManager);
}

export type ModalManager = InstanceType<typeof Modal_Manager>

class Modal_Manager {
    requestManager: RequestManager
    private modalList: Record<string, any> = {}
    private background: HTMLElement | null = null
    private root: HTMLElement | null = null

    constructor(RequestManager: RequestManager) {
        this.requestManager = RequestManager
    }

    async onMounted () {
        this.background = document.getElementById("ModalParentContainer")
        this.root = document.getElementById("ModalChildContainer")
    }

    async showModal(name: string, component: Component, context: any = {}) {
        if (!this.root || !this.background){return}
        context.name = name
        context.modalManager = this
        this.modalList[name] =  createApp(component, context)
        this.modalList[name].mount(this.root)
        this.background.style.opacity = "100%"
        this.background.style.pointerEvents = "auto"
        this.requestManager.refreshTimerPaused.value = true
        return this.modalList[name]
    }

    async hideModal(name: string) {
        if (!this.root || !this.background){return}
        this.modalList[name].unmount()
        delete this.modalList[name]
        if (Object.keys(this.modalList).length === 0) {
            this.background.style.opacity = "0"
            this.background.style.pointerEvents = "none"
            this.requestManager.refreshTimerPaused.value = false
        }
    }
}


