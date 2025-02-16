import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: any, res: any, next: (error?: any) => void): Promise<any> {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const accessToken = authHeader.split(' ')[1];
      console.log(`Access token o middleware: ${accessToken}`);
      const user = await this.authService.validateAccessToken(accessToken);
      console.log('user after validate : ', user);
      if (!user) {
        console.log('Token không hợp lệ, từ chối truy cập.');
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
