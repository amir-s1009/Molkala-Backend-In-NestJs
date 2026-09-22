import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { ApiOutput, CustomApiOutput } from '../../types.js';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((response) => {
        if (response instanceof CustomApiOutput) {
          return {
            ok: true,
            code: 200,
            data: response.output.data,
            message: response.output.message,
            meta: response.output.meta,
          } as ApiOutput;
        }

        return {
          ok: true,
          code: 200,
          ...response,
        } as ApiOutput;
      }),
    );
  }
}
