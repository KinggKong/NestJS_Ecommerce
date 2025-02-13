import { Injectable } from '@nestjs/common';
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
}
