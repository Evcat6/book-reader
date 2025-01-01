import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AppLogger } from '../service/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public constructor(private logger: AppLogger) {}
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    const responsePayload = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    };

    if(typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse &&
      Array.isArray((exceptionResponse as { message: string[] }).message)) {
        responsePayload.message = exceptionResponse.message[0]
    }
    this.logger.error(responsePayload.message);

    response.status(status).json(responsePayload);
  }
}
