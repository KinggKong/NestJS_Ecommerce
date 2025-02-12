import { Body, Controller, Post, Req, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dto/request/user.create';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('/api/v1/users')
@ApiTags('01.Users')
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
}
