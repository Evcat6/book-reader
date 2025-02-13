import { DataStatus } from "@/common/enums";
import { defineStore } from "pinia";

type State = {
    dataStatus: DataStatus;
    notification: 
};

const defaultState: State = {
    dataStatus: DataStatus.IDLE,
};

export const useWebsocketNotificationStore = defineStore('websocket-notification',)