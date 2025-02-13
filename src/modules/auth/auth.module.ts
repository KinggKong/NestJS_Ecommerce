import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/User';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      // secret: process.env.JWT_SECRET_KEY,
      secret:
        'DE4GK+7ZZoJOUJL9maS9A9FEfvHQcInAl4bX4iplI8r+onxhAwdKMdFsaBuWGoJm',
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class AuthModule {}
