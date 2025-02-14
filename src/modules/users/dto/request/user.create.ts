import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CreateUserRequest {
  @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
  @IsString({ message: 'username must be string' })
  @IsNotEmpty({ message: 'username cant empty or null' })
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user',
  })
  @IsString({ message: 'email must be string' })
  @IsNotEmpty({ message: 'email cant empty or null' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '88888888', description: 'Password of the user' })
  @IsString({ message: 'password must be string' })
  @IsNotEmpty({ message: 'password cant empty or null' })
  @Length(5, 25, { message: 'password must be at least 5 characters' })
  password: string;

  @ApiProperty({
    example: '123 Main Street, NY',
    description: 'Address of the user',
  })
  @IsString({ message: 'address must be string' })
  @IsNotEmpty({ message: 'address cant empty or null' })
  @Transform(({ value }) => (value === null ? undefined : value))
  address: string;
}
