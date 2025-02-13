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
import { Role } from '../../entities/Role';

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

    request.password = await this.hashPassword(request.password);

    const user = UserMapper.toUser(request);
    user.role = new Role(2, 'ROLE_USER');

    const insertedUser = await this.userRepository.save(user);
    return new ApiResponse(
      1000,
      'User created successfully',
      UserMapper.toUserResponse(insertedUser),
    );
  }

  async findById(id: number): Promise<ApiResponse<UserResponse>> {
    const user = await this.findUserById(id);
    return new ApiResponse(
      1000,
      `User found with id: ${id}`,
      UserMapper.toUserResponse(user),
    );
  }

  async findAll(page: number, size: number): Promise<ApiResponse<any>> {
    if (page < 0) {
      page = 1;
    }
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
    });

    return new ApiResponse(1000, 'Users fetched successfully', {
      users: UserMapper.toUserResponseList(users),
      pagination: {
        total,
        totalPages: Math.ceil(total / size),
        currentPage: page,
        itemsPerPage: size,
      },
    });
  }

  async updateUser(
    id: number,
    userUpdate: Partial<User>,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.findUserById(id);
    await this.userRepository.update(id, userUpdate);

    return new ApiResponse(1000, `User updated successfully with id: ${id}`, {
      ...user,
      ...userUpdate,
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<string>> {
    await this.findUserById(id);
    await this.userRepository.delete(id);
    return new ApiResponse(
      1000,
      `User deleted successfully with id: ${id}`,
      'Deleted user successfully',
    );
  }

   async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) throw new AppException('USER_NOT_FOUND');
    return user;
  }

  private async validateCreateUser(request: CreateUserRequest): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: request.email }, { username: request.username }],
    });

    if (existingUser) {
      if (existingUser.email === request.email)
        throw new AppException('USER_EMAIL_EXISTED');
      if (existingUser.username === request.username)
        throw new AppException('USER_USERNAME_EXISTED');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async isExistedByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  getProfile(user: any) {
    return new ApiResponse(1000, 'get profile successfully', user);
  }
}
