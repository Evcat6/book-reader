import { StorageKey } from "@/common/enums";
import { io, Socket } from "socket.io-client";
import { StorageService } from "../storage/storage.service";

class SocketService {

    private instance: Socket;

    constructor(private storage: StorageService, private url: string) {
        console.log(this.storage.get(StorageKey.TOKEN));
        this.instance = io(this.url, {
            autoConnect: false,
            extraHeaders: {
                authorization: `Bearer ${this.storage.get(StorageKey.TOKEN)}`
            }
        });
    }

    public getInstance(): Socket {
        console.log(this.instance);
        if(this.instance.connected === false) {
            this.instance.connect();
        }
        return this.instance;
    }

}

export { SocketService };
