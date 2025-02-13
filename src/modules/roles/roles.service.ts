import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from '../../entities/Role';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponse } from '../../common/api.response';
import { AppException } from '../../exception/app.exception';
import { RoleCreateRequest } from './dto/role.create';

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

  async getRoleById(id: number) {
    const role = await this.findRoleById(id, ['users']);
    return new ApiResponse(1000, 'Get role successfully', role);
  }

  async findByNames(names: string[]): Promise<Role[]> {
    return await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name IN (:...names)', { names })
      .getMany();
  }

  async insertRole(roleRequest: RoleCreateRequest) {
    await this.ensureRoleNameNotExists(roleRequest.name);

    const newRole = this.roleRepository.create({ name: roleRequest.name });
    await this.roleRepository.save(newRole);

    return new ApiResponse(1000, 'Role created successfully', newRole);
  }

  async delete(id: number) {
    const role = await this.findRoleById(id);
    await this.roleRepository.delete(id);
    return new ApiResponse(1000, `Role deleted successfully with id: ${id}`, 'deleted');
  }

  async updateRole(id: number, request: RoleCreateRequest) {
    const role = await this.findRoleById(id);
    await this.ensureRoleNameNotExists(request.name, id);

    await this.roleRepository.update(id, request);
    return new ApiResponse(1000, 'Role updated successfully', { ...role, ...request });
  }

  private async findRoleById(id: number, relations: string[] = []): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id }, relations });
    if (!role) throw new AppException('ROLE_NOT_FOUND');
    return role;
  }
  private async ensureRoleNameNotExists(name: string, excludeId?: number) {
    const role = await this.roleRepository.findOneBy({ name });
    if (role && role.id !== excludeId) throw new AppException('ROLE_NAME_EXIST');
  }
}
