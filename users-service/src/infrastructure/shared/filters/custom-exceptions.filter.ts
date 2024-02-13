import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { ZodError } from 'zod';
import { AppException } from '../../../domain/shared/exceptions';

@Catch()
export class CustomExceptionFilter implements RpcExceptionFilter<any> {
  private exceptionConverter(exception: any): RpcException {
    if (exception instanceof AppException) {
      return new RpcException({
        message: exception.message,
        error: exception.name,
        statusCode: exception.statusCode,
      });
    }

    if (exception instanceof ZodError) {
      return new RpcException({
        message: exception.issues,
        error: exception.name,
        statusCode: 400,
      });
    }

    if (exception instanceof RpcException) {
      return exception;
    }

    return new RpcException({
      message: exception.error?.message || 'An unexpected error occurred',
      error: exception.error?.name || 'Internal server error',
      statusCode: exception.error?.statusCode || 500,
    });
  }

  catch(exception: any): Observable<RpcException> {
    console.error(exception);
    return throwError(() => this.exceptionConverter(exception));
  }
}
