import { ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  getMessage(message: string | Record<string, any>): string {
    if (typeof message === 'string') {
      return message;
    } else if (typeof message === 'object') {
      return message?.message || '';
    }
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const message = exception.getResponse();

    const ctx = host.switchToHttp();

    const request = ctx.getRequest();
    const response = ctx.getResponse();

    response.status(status).json({
      status: status,
      message: this.getMessage(message),
      method: request.method,
      url: request.url,
    });
  }
}
