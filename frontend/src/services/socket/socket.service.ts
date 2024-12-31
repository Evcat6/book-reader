import { StorageKey } from "@/common/enums";
import { io, Socket } from "socket.io-client";
import { StorageService } from "../storage/storage.service";

class SocketService {

    private instance: Socket;

    constructor(private storage: StorageService, private url: string) {
        this.instance = io(this.url, {
            autoConnect: false,
            auth: {
                token: `Bearer ${this.storage.get(StorageKey.TOKEN)}`
            },
            transports: ['websocket', 'polling']
        });
    }

    public getInstance(): Socket {
        if(this.instance.connected === false) {
            this.instance.connect();
        }
        return this.instance;
    }

}

export { SocketService };
