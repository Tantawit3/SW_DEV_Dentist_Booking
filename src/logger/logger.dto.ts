import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class LoggerDto {
  @IsString()
  @IsNotEmpty()
  method: string;

  @IsString()
  @IsNotEmpty()
  endPoint: string;

  @IsString()
  @IsNotEmpty()
  statusCode: string;

  @IsNumber()
  @IsNotEmpty()
  contentLength: number;

  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @IsString()
  @IsNotEmpty()
  ip: string;

  @IsObject()
  body: {};

  @IsString()
  @IsOptional()
  statusStack?: string;
}
