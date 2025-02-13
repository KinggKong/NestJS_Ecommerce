import { Module } from '@nestjs/common';
import { RoleService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from '../../entities/Role';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from '../auth/guards/roles.guard';


@Module({
  controllers: [RolesController],
  providers: [RoleService, RolesGuard],
  imports: [TypeOrmModule.forFeature([Role])],
  exports: [RoleService],
})
export class RolesModule {}
