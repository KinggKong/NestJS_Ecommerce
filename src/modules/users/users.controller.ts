import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dto/request/user.create';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../entities/User';

@Controller('/api/v1/users')
@ApiTags('01.Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  getAllUser() {
    return this.usersService.findAll();
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
