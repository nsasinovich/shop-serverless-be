import { StatusCode } from '@/consts/statusCode';
import { defaultHeaders } from '@/consts/headers';
import { HttpResponse } from './httpResponse';

describe('HttpResponse', () => {
  it('#createErrorResponse', () => {
    expect(HttpResponse.createErrorResponse(StatusCode.ServerError, 'error messsage')).toEqual({
      statusCode: 500,
      headers: defaultHeaders,
      body: '{"message":"error messsage"}',
    });
  });

  it('#createSuccessResponse', () => {
    expect(HttpResponse.createSuccessResponse({ product: 'productData' })).toEqual({
      statusCode: 200,
      headers: defaultHeaders,
      body: '{"product":"productData"}',
    });
  });
});
