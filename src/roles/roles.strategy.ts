import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { UsersService } from "../users/users.service";

@Injectable()
export class RolesStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ROLES_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneId(payload.sub._id);
    return { roles: user.roles };
  }
}
