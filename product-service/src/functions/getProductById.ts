import { APIGatewayProxyResult } from 'aws-lambda';
import { getProductsListMock } from '@/mocks/getProductsListMock';
import { HttpResponse } from '@/utils/httpResponse';
import { StatusCode } from '@/consts/statusCode';

export const getProductById = async (event): Promise<APIGatewayProxyResult> => {
  console.log('Lambda invocation with event: ', JSON.stringify(event));

  const productId = event.pathParameters?.productId;

  if (!productId) {
    return HttpResponse.createErrorResponse(StatusCode.BadRequest, 'productId is not valid');
  }
  try {
    const products = await getProductsListMock();
    const product = products.find((product) => product.id === productId);

    if (!product) {
      return HttpResponse.createErrorResponse(StatusCode.NotFound, 'Product not found');
    }

    return HttpResponse.createSuccessResponse(product);
  } catch (e) {
    return HttpResponse.createErrorResponse(StatusCode.ServerError, 'Something went wrong');
  }
};
