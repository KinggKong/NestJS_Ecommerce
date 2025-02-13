import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dto/request/user.create';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { ROLES } from '../../common/enum/role.constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/api/v1/users')
@ApiTags('01.Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({
    description: 'Create a new user',
    type: CreateUserRequest,
  })
  insertUser(@Body() createUserRequest: CreateUserRequest) {
    return this.usersService.insertUser(createUserRequest);
  }

  @Get('/pro')
  getProfile(@Request() req: any) {
    console.log('profle',req.user);
    return req.user;
  }

  @Get(':id')
  findById(@Param('id') id: number, @Request() req: any) {
    return this.usersService.findById(id);
  }



  @Get()
  @Roles(ROLES.ADMIN)
  getAllUser(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ) {
    page = Math.max(1, page);
    size = Math.max(1, size);
    return this.usersService.findAll(page, size);
  }

  @Put(':id')
  updateUser(@Body() userUpdate: CreateUserRequest, @Param('id') id: number) {
    return this.usersService.updateUser(id, userUpdate);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }


}
