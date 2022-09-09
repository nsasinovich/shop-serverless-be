import { APIGatewayProxyResult } from 'aws-lambda';
import { Product } from 'src/types/products';
import { StatusCode } from '@/consts/statusCode';
import { HttpResponse } from '@/utils/httpResponse';
import { getProductsListMock } from '@/mocks/getProductsListMock';

export const getProductsList = async (event): Promise<APIGatewayProxyResult> => {
  console.log('Lambda invocation with event: ', JSON.stringify(event));
  try {
    const products: Product[] = await getProductsListMock();

    console.log('Products received: ', JSON.stringify(products));

    return HttpResponse.createSuccessResponse(products);
  } catch (e) {
    console.log('An error occured while loading products', e);

    return HttpResponse.createErrorResponse(StatusCode.ServerError, 'Something went wrong');
  }
};
