import { defaultHeaders } from '@/consts/headers';
import { StatusCode } from '@/consts/statusCode';

interface ResponseInterface {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export class HttpResponse {
  private static createResponse = (statusCode: StatusCode, data: unknown): ResponseInterface => ({
    statusCode,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify(data),
  });

  static createErrorResponse(statusCode: StatusCode, message: string): ResponseInterface {
    return this.createResponse(statusCode, { message });
  }

  static createSuccessResponse(data: unknown): ResponseInterface {
    return this.createResponse(StatusCode.Success, data);
  }
}
