import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger();

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.error(
      `Error occurred in ${request.method} ${request.url}`,
      exception.stack,
      exception,
    );

    response.status(status).json({
      statusCode: status,
      error: exception.message,
      message:
        exception.getResponse()['message'] ||
        exception.message ||
        'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
