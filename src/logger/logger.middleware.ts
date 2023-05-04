import { NextFunction, Request, Response } from 'express';

import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';

import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  async use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    response.on('finish', async () => {
      const { statusCode } = response;
      if (statusCode != HttpStatus.INTERNAL_SERVER_ERROR) {
        await this.loggerService.crateAndSaveLog(request, response, null);
      }
    });
    next();
  }

  private responseHandler() {}
}
