import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import * as requestIp from 'request-ip';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { saltOrRounds } from '../constants/hash';
import { LoggerDto } from './logger.dto';
import { LoggerClass, LoggerDocument } from './logger.schema';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(LoggerClass.name) private loggerModel: Model<LoggerDocument>,
  ) {}

  private logger = new Logger('HTTP');

  async savingLog(loggerDto: LoggerDto) {
    let createdLog = new this.loggerModel(loggerDto);
    return createdLog.save();
  }

  async logToConsole(
    request: Request,
    logMessage: String,
    statusCode: any,
    method: any,
  ): Promise<void> {
    if (statusCode >= 500) {
      this.logger.error(logMessage);
    } else if (statusCode >= 400) {
      this.logger.warn(logMessage);
    } else {
      this.logger.log(logMessage);
    }
    if (method != 'GET') {
      this.logger.debug(request.body);
    }
  }

  async crateAndSaveLog(
    request: Request | any,
    response: Response,
    exception: Error,
  ): Promise<void> {
    const { method, originalUrl } = request;
    const clientIp = requestIp.getClientIp(request);

    const userAgent = request.get('user-agent') || '';
    //initilize variable
    if (request.body.password)
      request.body.password = await bcrypt.hash(
        request.body.password,
        saltOrRounds,
      );
    if (request.body.newPassword)
      request.body.newPassword = await bcrypt.hash(
        request.body.newPassword,
        saltOrRounds,
      );
    if (request.body.oldPassword)
      request.body.oldPassword = await bcrypt.hash(
        request.body.oldPassword,
        saltOrRounds,
      );
    // if exception is not null, it is internal server error(500)
    const statusCode = exception
      ? HttpStatus.INTERNAL_SERVER_ERROR
      : response.statusCode;
    const contentLength = parseInt(response.get('content-length')) || 0;
    //get email from request.user return <Guest> if the request.user is not found
    let email = '';
    const user: any = request.user;
    if (statusCode === 401) email = '<Bad Token>';
    else email = user ? user.email : '<Guest>';
    let logMessage: String;
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      logMessage = `${method} ${originalUrl} Status:${statusCode} ContentLength:${contentLength} - email:${email} UserAgent:${userAgent} IP:${clientIp} errorStack:${exception.stack}`;
    } else {
      logMessage = `${method} ${originalUrl} Status:${statusCode} ContentLength:${contentLength} - email:${email} UserAgent:${userAgent} IP:${clientIp}$`;
    }
    await this.logToConsole(request, logMessage, statusCode, method);

    //save logged date if the error is not internal server error
    await this.savingLog({
      method: method,
      endPoint: originalUrl,
      statusCode: statusCode.toString(),
      contentLength: contentLength,
      email: email,
      userAgent: userAgent,
      ip: clientIp,
      body: request.body,
      statusStack: exception ? exception.stack : null,
    });
  }
}
