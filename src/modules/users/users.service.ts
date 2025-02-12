import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/User';
import { Repository } from 'typeorm';
import { CreateUserRequest } from './dto/request/user.create';
import { ApiResponse } from '../../common/api.response';
import { AppException } from '../../exception/app.exception';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async insertUser(request: CreateUserRequest): Promise<ApiResponse<User>> {
    await this.validateCreateUser(request);

    request.password = await bcrypt.hash(request.password, 10);

    const insertUser = await this.userRepository.save(request);
    return new ApiResponse(1000, 'Created user successfully', insertUser);
  }

  async isExistedByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async validateCreateUser(request: CreateUserRequest): Promise<void> {
    const existingUserByEmail = await this.userRepository.findOneBy({
      email: request.email,
    });
    if (existingUserByEmail) {
      throw new AppException('USER_EMAIL_EXISTED');
    }

    const existingUserByUsername = await this.userRepository.findOneBy({
      username: request.username,
    });
    if (existingUserByUsername) {
      throw new AppException('USER_USERNAME_EXISTED');
    }
  }
}
