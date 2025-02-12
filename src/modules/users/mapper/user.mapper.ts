import { CreateUserRequest } from '../dto/request/user.create';
import { User } from '../../../entities/User';
import { UserResponse } from '../dto/response/user.response';

export class UserMapper {
  static toUser(createUserRequest: CreateUserRequest) {
    const userEntity = new User();
    userEntity.username = createUserRequest.username;
    userEntity.email = createUserRequest.email;
    userEntity.password = createUserRequest.password;
    userEntity.address = createUserRequest.address;
    return userEntity;
  }

  static toUserResponse(userEntity: User) {
    const userResponse = new UserResponse();
    userResponse.id = userEntity.id;
    userResponse.username = userEntity.username;
    userResponse.email = userEntity.email;
    userResponse.address = userEntity.address;
    return userResponse;
  }
}
