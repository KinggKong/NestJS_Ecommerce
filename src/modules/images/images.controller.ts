import { Controller, Get, Param } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('/api/v1/images')
@ApiTags('05.images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('/product/:id')
  getImageByProductId(@Param('id') idProduct: number) {
    return this.imagesService.getImageByProductId(idProduct);
  }
}
