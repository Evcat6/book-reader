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
import { Cache } from '@nestjs/cache-manager';

import { Server, Socket } from "socket.io";
import { RedisKeyPrefix } from "@/common/enum";

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(AuthGuard)
export class AppGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private logger: AppLogger,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    @WebSocketServer() io: Server;

    afterInit() {
        this.logger.log("Initialized");
    }

    async handleConnection(client: Socket, ...args: any[]) {
        const { sockets } = this.io.sockets;

        // await this.cacheManager.set(`${RedisKeyPrefix.WEB_SOCKET_USER}:${client.user.id}`, client.id);
        this.logger.log(`Client id: ${client.id} connected`);
        this.logger.debug(`Number of connected clients: ${sockets.size}`);
    }

    async handleDisconnect(client: Socket) {
        // await this.cacheManager.del(`${RedisKeyPrefix.WEB_SOCKET_USER}:${client.user.id}`);
        this.logger.log(`Client id:${client.id} disconnected`);
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