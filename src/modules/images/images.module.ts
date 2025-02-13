import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../../entities/Image';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
  imports: [TypeOrmModule.forFeature([Image])],
})
export class ImagesModule {}
