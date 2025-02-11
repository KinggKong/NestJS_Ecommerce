// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
// } from '@nestjs/common';
// import { ApiResponse } from '../common/api.response';
//
// @Catch(HttpException)
// export class GlobalHandleException implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//
//     const status = exception.getStatus();
//     const errorResponse = exception.getResponse();
//
//     const apiResponse: ApiResponse<null> = {
//       data: null,
//       statusCode:  errorResponse.errorCode || 'UNKNOWN_ERROR',
//       message: errorResponse.message || 'Unexpected error',
//       url: request.url,
//     };
//   }
// }
