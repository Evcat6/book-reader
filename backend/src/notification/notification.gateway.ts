import { AuthGuard } from "@/auth/guard/auth.guard";
import { AppLogger } from "@/common/service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, UseGuards } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

import { Server } from "socket.io";

@WebSocketGateway({ path: 'notifications' })
@UseGuards(AuthGuard)
export class NotificationsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        private logger: AppLogger, @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) { }

    @WebSocketServer() io: Server;

    afterInit() {
        this.logger.log("Initialized");
    }

    handleConnection(client: any, ...args: any[]) {
        const { sockets } = this.io.sockets;

        this.logger.log(`Client id: ${client.id} connected`);
        this.logger.debug(`Number of connected clients: ${sockets.size}`);
    }

    handleDisconnect(client: any) {
        this.logger.log(`Cliend id:${client.id} disconnected`);
    }

    @SubscribeMessage("ping")
    handleMessage(client: any, data: any) {
        this.logger.log(`Message received from client id: ${client.id}`);
        this.logger.debug(`Payload: ${data}`);
        return {
            event: "pong",
            data: "Wrong data that will make the test fail",
        };
    }
}