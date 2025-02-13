import { UserService } from "@/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { JwtTokenPayload } from "../types";
import { ConfigService } from "@nestjs/config";

export interface AuthSocket extends Socket {
  user: {
    email: string;
    id: string;
  }
};

export type SocketIOMiddleware = (socket: Socket, next: (err?: Error) => void) => Promise<void>;

export const AuthWsMiddleware = (
  jwtService: JwtService,
  userService: UserService,
  configService: ConfigService
): SocketIOMiddleware => {
  return async (socket: Socket, next) => {
    try {
      const [,token] = socket.handshake?.auth?.token.split(' ') ?? [];


      if (!token) {
        throw new Error('Authorization token is missing');
      }

      let payload: JwtTokenPayload | null = null;

      try {
        payload = await jwtService.verifyAsync<JwtTokenPayload>(token, {
          secret: configService.get('JWT_SECRET'),
        });
      } catch (error) {
        throw new Error('Authorization token is invalid');
      }

      const user = await userService.findById(payload.sub);

      if (!user) {
        throw new Error('User does not exist');
      }

      socket = Object.assign(socket, {
        user: user
      });
      next();
    } catch (error) {
      next(new Error('Unauthorized'));
    }
  };
};