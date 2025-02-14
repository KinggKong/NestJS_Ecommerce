import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TimingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void): any {
    req['start'] = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - req['start'];
      console.log(`Request: ${req.method} ${req.url} took ${duration}ms`);
    });

    next();
  }
}
