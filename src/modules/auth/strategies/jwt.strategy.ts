import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        'DE4GK+7ZZoJOUJL9maS9A9FEfvHQcInAl4bX4iplI8r+onxhAwdKMdFsaBuWGoJm',
    });
  }

  async validate(payload: any) {
    console.log(payload.sub, payload.email, payload.role);
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
