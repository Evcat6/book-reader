import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from '@/common/decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly reflector: Reflector
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Determine if the request is HTTP or WebSocket
    if (context.getType<'http'>() === 'http') {
      return this.handleHttpRequest(context);
    } else if (context.getType<'ws'>() === 'ws') {
      return this.handleWsRequest(context);
    }

    throw new UnauthorizedException('Unsupported request type');
  }

  private async handleHttpRequest(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      request['user'] = { email: payload.email, id: payload.sub }; // Attach the user to the request
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private async handleWsRequest(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = this.extractTokenFromWsClient(client);

    if (!token) {
      throw new WsException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      client.user = { email: payload.email, id: payload.sub };; // Attach the user to the WebSocket client
    } catch {
      throw new WsException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromWsClient(client: any): string | undefined {
    // Typically, WebSocket tokens are passed via headers or query params.
    const authHeader = client.handshake?.headers?.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      return type === 'Bearer' ? token : undefined;
    }

    // Optionally, check for a token in the query string
    return client.handshake?.query?.token;
  }
}
