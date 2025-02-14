import { Exclude, Expose } from 'class-transformer';

export class UserResponse {
  id: number;

  username: string;

  email: string;

  @Exclude()
  password: string;

  address: string;
}
