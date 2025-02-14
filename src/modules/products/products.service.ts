import { Injectable } from '@nestjs/common';
import { ProductCreateRequest } from './dto/product.create';
import { ImagesService } from '../images/images.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entities/Product';
import { Repository } from 'typeorm';
import { AppException } from '../../exception/app.exception';
import { ProductMapper } from './mapper/product.mapper';
import { ApiResponse } from '../../common/api.response';

@Injectable()
export class ProductsService {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly fileUploadService: FileUploadService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async insertProduct(
    request: ProductCreateRequest,
    file: Express.Multer.File,
  ) {
    await this.ensureProductNameNotExists(request.name);

    const insertProduct = await this.productRepository.save(
      ProductMapper.toProductEntity(request),
    );

    const url = await this.fileUploadService.handleFileUpload(file);

    await this.imagesService.insertImage(insertProduct, url);

    return new ApiResponse(1000, 'insert product successfully', {
      ...insertProduct,
      url: { url },
    });
  }

  async findByName(name: string) {
    const product = await this.productRepository.findOne({ where: { name } });
    if (!product) throw new AppException('PRODUCT_NOT_FOUND');
    return product;
  }

  async findById(id: number, relations: string[] = []) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations,
    });
    if (!product) throw new AppException('PRODUCT_NOT_FOUND');
    return product;
  }

  private async ensureProductNameNotExists(name: string, excludeId?: number) {
    const product = await this.productRepository.findOneBy({ name });
    if (product && product.id !== excludeId)
      throw new AppException('PRODUCT_NAME_EXIST');
  }

  async getAllProduct(page: number, size: number) {
    const [products, total] = await this.productRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      relations: ['images'],
    });
    return new ApiResponse(1000, 'get all products', {
      products,
      pagination: {
        total,
        totalPages: Math.ceil(total / size),
        currentPage: page,
        itemsPerPage: size,
      },
    });
  }

  async getById(id: number) {
    const product = await this.findById(id,['images']);
    return new ApiResponse(1000, 'get product', product);
  }

  async delete(id: number) {
    const product = await this.findById(id);
    await this.imagesService.deleteImageByProductId(id);
    await this.productRepository.delete(id);
    return new ApiResponse(
      1000,
      `deleted product successfully ${id}`,
      'successfully deleted',
    );
  }

  async updateProduct(id: number, request: ProductCreateRequest) {
    const product = await this.findById(id);
    await this.productRepository.update(id, request);
    const productAfterUpdate = await this.productRepository.findOneBy({ id });
    return new ApiResponse(
      1000,
      'updated product successfully',
      productAfterUpdate,
    );
  }
}
