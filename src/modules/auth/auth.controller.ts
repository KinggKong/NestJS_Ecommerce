import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserRequest } from '../users/dto/request/user.create';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserLoginRequest } from './dto/request/user.login';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@ApiTags('02.Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiBody({
    description: 'Create a new user',
    type: CreateUserRequest,
  })
  register(@Body() createUserRequest: CreateUserRequest) {
    return this.authService.register(createUserRequest);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({
    description: 'Login with account',
  })
  login(@Req() req: any) {
    console.log(req.user);
    return this.authService.login(req.user);
  }
}
