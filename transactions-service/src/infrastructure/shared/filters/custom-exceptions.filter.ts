import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { AppException } from 'src/domain/shared/exceptions';
import { ZodError } from 'zod';

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

@Catch(ZodError)
export class ZodValidationExceptionFilter
  implements RpcExceptionFilter<ZodError>
{
  catch(exception: ZodError): Observable<RpcException> {
    return throwError(
      () =>
        new RpcException({
          name: exception.name,
          statusCode: 400,
          message: exception.issues,
        }),
    );
  }
}
