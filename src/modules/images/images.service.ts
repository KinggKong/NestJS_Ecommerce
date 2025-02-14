import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from '../../entities/Image';
import { Repository } from 'typeorm';
import { Product } from '../../entities/Product';
import { ApiResponse } from '../../common/api.response';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async insertImage(product: Product, url: string) {
    const image = new Image();
    image.url = url;
    image.product = product;
    return await this.imageRepository.save(image);
  }

  async deleteImageByProductId(idProduct: number) {
    await this.imageRepository.delete({ product: { id: idProduct } });
  }

  async getImageByProductId(idProduct: number) {
    const images = await this.imageRepository.find({
      where: { product: { id: idProduct } },
    });
    return new ApiResponse(
      1000,
      'get images by product id successfully',
      images,
    );
  }

  async uploadImageProduct(productId: number, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    // validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    // validate file size (e.g., max 5mb)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    const url = `http://localhost:3000/uploads/${file.filename}`.replace(
      /\\/g,
      '/',
    );
    const image = this.imageRepository.create({
      url,
      product: { id: productId },
    });

    const insertImage = await this.imageRepository.save(image);

    return new ApiResponse(
      1000,
      'insert image product successfully',
      insertImage,
    );
  }
}
