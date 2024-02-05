import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements HttpExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    return response.status(exception.error?.statusCode || 500).json({
      message: exception.error?.message || 'An unexpected error occurred',
      error: exception.error?.name || 'Internal server error',
      statusCode: exception.error?.statusCode || 500,
    });
  }
}
