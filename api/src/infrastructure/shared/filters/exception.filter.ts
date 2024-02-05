import { ArgumentsHost, Catch } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements HttpExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    return response.status(exception.error?.statusCode || 500).json({
      error: {
        name: exception.error?.name || 'Internal server error',
        statusCode: exception.error?.statusCode || 500,
        message: exception.error?.message || 'An unexpected error occurred',
      },
    });
  }
}
