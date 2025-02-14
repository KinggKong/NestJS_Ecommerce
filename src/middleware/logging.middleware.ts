import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void): any {
    console.log('Middleware executed');
    console.log(`Logging middleware for: ${req.originalUrl} ${req.method}`);
    next();
  }
}
