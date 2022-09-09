import { APIGatewayProxyResult } from 'aws-lambda';
import { Product, ProductProviderInterface } from 'src/types/products';
import { StatusCode } from '@/consts/statusCode';
import { HttpResponse } from '@/utils/httpResponse';

export const getProductsList =
  (productProvider: ProductProviderInterface) =>
  async (event): Promise<APIGatewayProxyResult> => {
    console.log('Lambda invocation with event: ', JSON.stringify(event));
    try {
      const products: Product[] = await productProvider.getProducts();

      console.log('Products received: ', JSON.stringify(products));

      return HttpResponse.createSuccessResponse(products);
    } catch (e) {
      console.log('An error occured while loading products', e);

      return HttpResponse.createErrorResponse(StatusCode.ServerError, 'Something went wrong');
    }
  };
