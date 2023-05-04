import { Strategy } from 'passport-local';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(payload: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(
      payload.toLowerCase(), //email
      password,
    );
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }
    return user;
  }
}
