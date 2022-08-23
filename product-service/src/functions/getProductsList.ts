import { APIGatewayProxyResult } from 'aws-lambda';
import { getProductsListMock } from '@mocks/getProductsListMock';
import { Product } from 'src/types/products';

export const getProductsList = async (event): Promise<APIGatewayProxyResult> => {
  console.log('Lambda invocation with event: ', JSON.stringify(event));
  try {
    const products: Product[] = await getProductsListMock();

    console.log('Products received: ', JSON.stringify(products));

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (e) {
    console.log('An error occured while loading products', e);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong' }),
    };
  }
};
