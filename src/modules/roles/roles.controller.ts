import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './roles.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RoleCreateRequest } from './dto/role.create';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { ROLES } from '../../common/enum/role.constant';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('/api/v1/roles')
@ApiTags('03.Roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Roles(ROLES.ADMIN)
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  @Roles(ROLES.ADMIN)
  getRole(@Param('id') id: number) {
    return this.roleService.getRoleById(id);
  }

  @Post()
  @Roles(ROLES.ADMIN)
  @ApiBody({
    type: RoleCreateRequest,
  })
  insertRole(@Body() roleRequest: RoleCreateRequest) {
    return this.roleService.insertRole(roleRequest);
  }

  @Delete(':id')
  @Roles(ROLES.ADMIN)
  deleteRole(@Param('id') id: number) {
    return this.roleService.delete(id);
  }

  @Put(':id')
  @Roles(ROLES.ADMIN)
  updateRole(@Param('id') id: number, @Body() request: RoleCreateRequest) {
    return this.roleService.updateRole(id, request);
  }
}
