import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserLoginRequest {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user',
  })
  @IsString({ message: 'email must be string' })
  @IsNotEmpty({ message: 'email cant empty or null' })
  email: string;

  @ApiProperty({ example: '88888888', description: 'Password of the user' })
  @IsString({ message: 'password must be string' })
  @IsNotEmpty({ message: 'password cant empty or null' })
  @Length(5, 25, { message: 'password must be at least 5 characters' })
  password: string;
}
