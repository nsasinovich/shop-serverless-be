import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HttpResponse } from '@/utils/httpResponse';
import { StatusCode } from '@/consts/statusCode';
import { ProductProviderInterface } from '@/types/products';

export const getProductById =
  (productProvider: ProductProviderInterface) =>
  async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    console.log('Lambda invocation with event: ', JSON.stringify(event));

    const productId = event.pathParameters?.productId;

    if (!productId) {
      return HttpResponse.createErrorResponse(StatusCode.BadRequest, 'productId is not valid');
    }
    try {
      const product = await productProvider.getProductById(productId);

      if (!product) {
        return HttpResponse.createErrorResponse(StatusCode.NotFound, 'Product not found');
      }

      return HttpResponse.createSuccessResponse(product);
    } catch (e) {
      return HttpResponse.createErrorResponse(StatusCode.ServerError, 'Something went wrong');
    }
  };
