import * as Joi from "joi";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UsersModule } from "../users/users.module";
import { RolesStrategy } from "./roles.strategy";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        ROLES_SECRET: Joi.string().required(),
      }),
    }),
    JwtModule.register({
      secret: process.env.ROLES_SECRET,
    }),
    PassportModule,
    UsersModule,
  ],
  providers: [RolesStrategy],
})
export class AuthModule {}
