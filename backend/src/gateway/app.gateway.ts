import { AuthGuard } from "@/auth/guard/auth.guard";
import { AppLogger } from "@/common/service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { BadRequestException, Inject, UseGuards } from "@nestjs/common";
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
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RedisKeyPrefix } from "@/common/enum";

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(AuthGuard)
export class AppGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly logger: AppLogger,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
        private readonly jwtService: JwtService,
        private configService: ConfigService
    ) { }

    @WebSocketServer() io: Server;

    afterInit() {
        this.logger.log("Initialized");
    }

    async handleConnection(client: Socket, ...args: any[]) {
        const { sockets } = this.io.sockets;
        const [,token] = client.handshake.auth.token?.split(' ') ?? [];

        try {
            const payload = await this.jwtService.verifyAsync(token as string, {
                secret: this.configService.get('JWT_SECRET'),
            });
            await this.cacheManager.set(`${RedisKeyPrefix.WEB_SOCKET_USER}:${payload.sub}`, client.id);
            this.logger.log(`Client id: ${client.id} (UserId):${payload.sub} connected`);
            this.logger.debug(`Number of connected clients: ${sockets.size}`);
        } catch {
            this.logger.error(`Bad token from client:${client.id} on connection`);
            client.disconnect();
        }

    }

    async handleDisconnect(client: Socket) {
        const [,token] = client.handshake.auth.token?.split(' ') ?? [];

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            await this.cacheManager.set(`${RedisKeyPrefix.WEB_SOCKET_USER}:${payload.sub}`, client.id);
            this.logger.log(`Client id:${client.id} (UserId):${payload.sub} disconnected`);
        } catch {}
    }

    @SubscribeMessage("ping")
    handleMessage(client: Socket, data: any) {
        console.log(client['user']);
        this.logger.log(`Message received from client id: ${client.id}`);
        this.logger.debug(`Payload: ${data}`);
        return {
            event: "pong",
            data: "Wrong data that will make the test fail",
        };
    }
}