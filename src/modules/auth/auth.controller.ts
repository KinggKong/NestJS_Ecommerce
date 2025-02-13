import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserRequest } from '../users/dto/request/user.create';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserLoginRequest } from './dto/request/user.login';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';

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
  @ApiBody({ type: UserLoginRequest, description: 'Login with account' })
  login(@Req() req: any) {
    return this.authService.login(req.user);
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    return { message: 'Redirecting to Google...' };
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() req, @Res() res) {
    const authResult = await this.authService.loginWithGoogle(req.user);
    return res.redirect(`http://localhost:3000/auth/success?token=${authResult.accessToken}`);
  }

  @Get('success')
  async success(@Req() req) {
    return { message: 'Login successful!', user: req.user };
  }
}
