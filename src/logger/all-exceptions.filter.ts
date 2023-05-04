import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Module
} from "@nestjs/common";

import { LoggerService } from "./logger.service";

@Module({
  imports: [],
  controllers: [],
  providers: [LoggerService],
})
@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';
    const prodErrorResponse = {
      statusCode,
      message,
    };
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      await this.loggerService.crateAndSaveLog(request, response, exception);
      return response.status(statusCode).json(prodErrorResponse);
    } else {
      return response.status(statusCode).json(errorResponse);
    }
  }
}
