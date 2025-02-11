export class ApiResponse<T> {
  data: T;
  statusCode: string;
  message: string;
  url: string;
}
