import { AuthGuard } from "@/auth/guard/auth.guard";
import { AppLogger } from "@/common/service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { HttpException, Inject, NotFoundException, UseGuards } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from "@nestjs/websockets";
import { Cache } from '@nestjs/cache-manager';

import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RedisKeyPrefix } from "@/common/enum";
import { AuthWsMiddleware } from "@/auth/middleware";
import { UserService } from "@/user/user.service";
import { AuthSocket } from "@/auth/middleware/websocket-auth.middleware";
import { NotificationService } from "@/notification/notification.service";

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly logger: AppLogger,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly notificationService: NotificationService
    ) { }

    @WebSocketServer() io: Server;

    afterInit(server: Server) {
        server.use(AuthWsMiddleware(this.jwtService, this.userService, this.configService));
        this.logger.log("Initialized");
    }

    async handleConnection(client: AuthSocket) {
        const { sockets } = this.io.sockets;

        try {
            await this.cacheManager.set(`${RedisKeyPrefix.WEB_SOCKET_USER}:${client.user.id}`, client.id);
            this.logger.log(`Client id: ${client.id} (UserId):${client.user.id} connected`);
            this.logger.debug(`Number of connected clients: ${sockets.size}`);
        } catch {
            this.logger.error(`Error occurred while connecting client:"${client.id}"`);
            client.disconnect();
        }
    }

    async handleDisconnect(client: AuthSocket) {
        this.logger.log(client.user);
        const [, token] = client.handshake.auth.token?.split(' ') ?? [];

        const payload = await this.jwtService.verifyAsync(token, {
            secret: this.configService.get('JWT_SECRET'),
        });
        await this.cacheManager.set(`${RedisKeyPrefix.WEB_SOCKET_USER}:${payload.sub}`, client.id);
        this.logger.log(`Client id:(${client.id}) UserId:(${payload.sub}) disconnected`);
    }


    @SubscribeMessage("load-notifications")
    async loadNotifications(client: AuthSocket, data: { offset: number; limit: number }) {
        this.logger.log(`event(load-notifications) received from Client id:(${client.id})`);
        const { id } = client.user;
        const { limit, offset } = data;
        try {
            const notifications = await this.notificationService.load(id, limit, offset);
            return {
                data: notifications,
                error: null
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    async createAndEmitNotification(userId: string, message: string) {
        const newNotification = await this.notificationService.create(userId, message);
        const { sockets } = this.io.sockets;
        const clientId: string | undefined = await this.cacheManager.get(`${RedisKeyPrefix.WEB_SOCKET_USER}:${userId}`);
        if(!clientId) return; // TODO: implement delayed notification
        const client = sockets.get(clientId);
        if(!client) return;
        client.emit("new-notification", {
            data: newNotification
        })
    }

    private handleError(error: unknown) {
        const errorResponse = { data: null, error: "" };
        if (error instanceof HttpException) {
            errorResponse.error = error.message;
        } else {
            errorResponse.error = "Unspecified Exception";
        }
        return errorResponse;
    }

}