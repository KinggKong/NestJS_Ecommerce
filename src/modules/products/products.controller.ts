import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductCreateRequest } from './dto/product.create';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { ROLES } from '../../common/enum/role.constant';
import { Min } from 'class-validator';

@Controller('/api/v1/products')
@ApiTags('04.Products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @Post()
  @Roles(ROLES.ADMIN,ROLES.USER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  insertProduct(
    @Body() request: ProductCreateRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.insertProduct(request, file);
  }

  @Get()
  @Roles(ROLES.ADMIN)
  getAllProduct(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ) {
    return this.productsService.getAllProduct(page, size);
  }

  @Get(':id')
  @Roles(ROLES.USER, ROLES.ADMIN)
  findProductById(@Param('id') id: number) {
    return this.productsService.getById(id);
  }

  @Delete(':id')
  @Roles(ROLES.ADMIN)
  deleteProduct(@Param('id') id: number) {
    return this.productsService.delete(id);
  }

  @Put(':id')
  @Roles(ROLES.ADMIN)
  updateProduct(
    @Param('id') id: number,
    @Body() request: ProductCreateRequest,
  ) {
    return this.productsService.updateProduct(id, request);
  }


  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        price: { type: 'number' },
        files: { type: 'array', items: { type: 'string', format: 'binary' } }
      },
    },
  })
  @Post('/insertWithManyImages')
  @Roles(ROLES.ADMIN, ROLES.USER)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async insertProductWithImages(
    @Body() request: ProductCreateRequest,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.productsService.insertProductWithImages(request, files || []);
  }
}
