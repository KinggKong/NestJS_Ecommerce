import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:'84372364959-7cs8fma6r3oqd29flac9ajfh4b7tsued.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user = {
      googleId: profile.id,
      email: profile.emails[0].value,
      displayName: profile.displayName,
      picture: profile.photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}