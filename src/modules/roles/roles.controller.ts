import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './roles.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RoleCreateRequest } from './dto/role.create';

@Controller('/api/v1/roles')
@ApiTags('03.Roles')
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  getRole(@Param('id') id: number) {
    return this.roleService.getRoleById(id);
  }

  @Post()
  @ApiBody({
    type: RoleCreateRequest,
  })
  insertRole(@Body() roleRequest: RoleCreateRequest) {
    return this.roleService.insertRole(roleRequest);
  }

  @Delete(':id')
  deleteRole(@Param('id') id: number) {
    return this.roleService.delete(id);
  }

  @Put(':id')
  updateRole(@Param('id') id: number, @Body() request: RoleCreateRequest) {
    return this.roleService.updateRole(id, request);
  }
}
