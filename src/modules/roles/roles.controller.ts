import { Controller, Get } from '@nestjs/common';
import { RoleService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('/api/v1/roles')
@ApiTags('03.Roles')
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  getAllRoles() {
    return this.roleService.getAllRoles();
  }
}
