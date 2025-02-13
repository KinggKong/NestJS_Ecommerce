import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ImagesModule } from '../images/images.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { Product } from '../../entities/Product';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    ImagesModule,
    FileUploadModule,
    TypeOrmModule.forFeature([Product]),
    RolesModule,
  ],
})
export class ProductsModule {}
