import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoleCreateRequest {
  @IsString({ message: 'name role must be string' })
  @IsNotEmpty({ message: 'name role cant empty or null' })
  @ApiProperty({
    example: 'ROLE_GUEST',
    description: 'Roles of the user',
  })
  name: string;
}
