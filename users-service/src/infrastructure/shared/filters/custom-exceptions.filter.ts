import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { AppException } from 'src/domain/shared/exceptions';

@Catch(AppException)
export class CustomExceptionFilter implements RpcExceptionFilter<AppException> {
  catch(exception: AppException): Observable<RpcException> {
    return throwError(
      () =>
        new RpcException({
          name: exception.name,
          statusCode: exception.statusCode,
          message: exception.message,
        }),
    );
  }
}
