export class ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  url?: string;

  constructor(code: number, message: string, data: T, url?: string) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.url = url;
  }

}
