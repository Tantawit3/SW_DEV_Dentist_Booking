import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

import { UsersService } from "../users/users.service";
import { Role } from "./enums/role.enum";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard extends AuthGuard('roles') {
  constructor(
    private usersService: UsersService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const trueUser = await this.usersService.findOneId(user._id);
    return requiredRoles.some((role) => trueUser.roles?.includes(role));
  }
}
