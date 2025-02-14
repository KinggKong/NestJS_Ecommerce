import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void): any {
    if (req.headers.authorization) {
      next();
    } else {
      res.status(401).json({
        message: 'Unauthorized',
        errorCode: 401,
      });
    }
  }
}
