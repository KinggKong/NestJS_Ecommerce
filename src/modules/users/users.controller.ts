import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dto/request/user.create';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../entities/User';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { ROLES } from '../../common/enum/role.constant';

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

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Get()
  @Roles(ROLES.ADMIN)
  getAllUser( @Query('page', ParseIntPipe) page: number,
              @Query('size', ParseIntPipe) size: number) {
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
