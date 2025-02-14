import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1/images')
@ApiTags('05.images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('/product/:id')
  getImageByProductId(@Param('id') idProduct: number) {
    return this.imagesService.getImageByProductId(idProduct);
  }

  @Post('/product/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadImageProduct(
    @Param('id') idProduct: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imagesService.uploadImageProduct(idProduct, file);
  }


}
