import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ActionError } from '../../errors.js';
import { ApiOutput } from '../../types.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response<ApiOutput>>();

    if (exception instanceof ActionError) {
      return response.status(exception.statusCode).json({
        ok: false,
        code: exception.statusCode,
        message: exception.message,
      });
    }

    return response.status(500).json({
      ok: false,
      code: 500,
      message: 'Internal server error',
    });
  }
}
