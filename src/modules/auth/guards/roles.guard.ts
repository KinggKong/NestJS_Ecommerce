import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { RoleService } from '../../roles/roles.service';
import { ROLES_KEY } from '../../../common/decorator/roles.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    const dbRoles = await this.rolesService.findByNames(requiredRoles);
    if (dbRoles.length !== requiredRoles.length) {
      return false;
    }
    return dbRoles.some((role) => role.name === user.role);
  }
}
