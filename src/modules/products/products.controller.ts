import { Body, Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductCreateRequest } from './dto/product.create';

@Controller('/api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  insertProduct(@Body() request: ProductCreateRequest){
    return this.productsService.insertProduct(request);
  }
}
