import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../../entities/Role';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from '../../common/api.response';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getAllRoles() {
    const roles = await this.roleRepository.find();
    return new ApiResponse(1000, 'get all successfully', roles);
  }

  async findByNames(names: string[]): Promise<Role[]> {
    return await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name IN (:...names)', { names })
      .getMany();
  }
}
