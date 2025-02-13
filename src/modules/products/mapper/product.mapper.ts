import { ProductCreateRequest } from '../dto/product.create';
import { Product } from '../../../entities/Product';

export class ProductMapper {
  static toProductEntity(request: ProductCreateRequest) {
    const product = new Product();
    product.name = request.name;
    product.price = request.price;
    return product;
  }
}
