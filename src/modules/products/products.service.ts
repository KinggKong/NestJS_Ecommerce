import { Injectable } from '@nestjs/common';
import { ProductCreateRequest } from './dto/product.create';

@Injectable()
export class ProductsService {
  insertProduct(request: ProductCreateRequest) {
    
  }
}
