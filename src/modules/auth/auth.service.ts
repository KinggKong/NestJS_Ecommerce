import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from '../users/dto/request/user.create';
import { UsersService } from '../users/users.service';
import { UserLoginRequest } from './dto/request/user.login';
import { AppException } from '../../exception/app.exception';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserRequest: CreateUserRequest) {
    return await this.userService.insertUser(createUserRequest);
  }

  login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateLogin(username: string, password: string) {
    const isExistedByEmail = await this.userService.isExistedByEmail(username);
    if (!isExistedByEmail) {
      throw new AppException('USER_EMAIL_NOT_EXIST');
    }

    const isMatch = await bcrypt.compare(password, isExistedByEmail.password);

    if (!isMatch) {
      throw new AppException('LOGIN_FAILED');
    }
    return isExistedByEmail;
  }
}
