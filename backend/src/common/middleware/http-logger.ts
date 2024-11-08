import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { AppLogger } from '../service/logger.service';

// https://github.com/julien-sarazin/nest-playground/issues/1#issuecomment-961810501
@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  public constructor(private logger: AppLogger) { }

  public use(request: Request, response: Response, next: NextFunction): void {
    const startAt = process.hrtime();
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;

      if (statusCode === 400) {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} ${responseTime}ms ${contentLength} - ${userAgent} ${ip}`
        );
      } else {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} ${responseTime}ms ${contentLength} - ${userAgent} ${ip}`
        );
      }
    });

    next();
  }
}
