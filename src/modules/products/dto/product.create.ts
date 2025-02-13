import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ProductCreateRequest {
  @IsString({ message: 'name must be string' })
  @IsNotEmpty({ message: 'name cant empty or null' })
  @ApiProperty({
    example: 'product1',
    description: 'Name of the product',
  })
  name: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price cannot be empty or null' })
  @Min(1, { message: 'Price must be at least 1' })
  @Transform(({ value }) => parseFloat(value))
  @ApiProperty({
    example: '88888',
    description: 'Price of the product',
  })
  price: number;
}
