import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: any, res: any, next: (error?: any) => void): Promise<any> {
    if (req.headers.authorization) {
      const accessToken = req.headers.authorization.split(' ')[1];
      const user = await this.authService.verifyAccessToken(accessToken);
      console.log('user after verify:', user);
      if (!user) {
        return res.status(401).json({
          message: 'Unauthorized',
          errorCode: 401,
        });
      }
      req.user = user;
      next();
    } else {
      res.status(401).json({
        message: 'Unauthorized',
        errorCode: 401,
      });
    }
  }
}
