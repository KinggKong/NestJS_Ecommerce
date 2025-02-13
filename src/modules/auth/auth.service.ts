import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from '../users/dto/request/user.create';
import { UsersService } from '../users/users.service';
import { AppException } from '../../exception/app.exception';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../entities/Role';
import { Repository } from 'typeorm';
import { User } from '../../entities/User';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserRequest: CreateUserRequest) {
    return await this.userService.insertUser(createUserRequest);
  }

  login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role.name };
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

  async loginWithGoogle(user: any) {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
      relations: ['role'],
    });

    if (!existingUser) {
      const newUser = this.userRepository.create({
        username: user.displayName,
        email: user.email,
        password: '',
        address: '',
        avt: user.picture || '',
        role: new Role(2, 'ROLE_USER'),
      });

      await this.userRepository.save(newUser);
      const payload = {
        sub: newUser.id,
        email: newUser.email,
        name: newUser.username,
      };
      const token = this.jwtService.sign(payload);

      return {
        message: 'Login successful (New User)',
        user: newUser,
        accessToken: token,
      };
    }

    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
      name: existingUser.username,
    };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful (Existing User)',
      user: existingUser,
      accessToken: token,
    };
  }
}
