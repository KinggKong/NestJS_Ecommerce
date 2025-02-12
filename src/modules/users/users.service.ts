import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/User';
import { Repository } from 'typeorm';
import { CreateUserRequest } from './dto/request/user.create';
import { ApiResponse } from '../../common/api.response';
import { AppException } from '../../exception/app.exception';
import * as bcrypt from 'bcryptjs';
import { UserMapper } from './mapper/user.mapper';
import { UserResponse } from './dto/response/user.response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async insertUser(
    request: CreateUserRequest,
  ): Promise<ApiResponse<UserResponse>> {
    await this.validateCreateUser(request);

    request.password = await bcrypt.hash(request.password, 10);

    const insertUser = await this.userRepository.save(
      UserMapper.toUser(request),
    );
    return new ApiResponse(
      1000,
      'Created user successfully',
      UserMapper.toUserResponse(insertUser),
    );
  }

  async isExistedByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async isExistById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
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

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new AppException('USER_NOT_FOUND');
    }
    return new ApiResponse(
      1000,
      'find user successfully with id: ' + id,
      UserMapper.toUserResponse(user),
    );
  }

  async findAll() {
    const users = await this.userRepository.find();
    return new ApiResponse(
      1000,
      'get all users successfully',
      UserMapper.toUserResponseList(users),
    );
  }

  async updateUser(id: number, userUpdate: Partial<User>) {
    if ((await this.isExistById(id)) == null) {
      throw new AppException('USER_NOT_FOUND');
    }
    await this.userRepository.update(id, userUpdate);
    const userAfterUpdate = await this.userRepository.findOneBy({ id });
    return new ApiResponse(
      1000,
      'update user succesfully with id: ' + id,
      userAfterUpdate,
    );
  }

  async deleteUser(id: number) {
    await this.findById(id);
    await this.userRepository.delete(id);
    return new ApiResponse(
      1000,
      'delete user successfully with id: ' + id,
      'deleted user successfully',
    );
  }
}
