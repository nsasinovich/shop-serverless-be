import { APIGatewayProxyResult } from 'aws-lambda';
import { getProductsListMock } from '@mocks/getProductsListMock';
import { headers } from '@consts/headers';

export const getProductById = async (event): Promise<APIGatewayProxyResult> => {
  console.log('Lambda invocation with event: ', JSON.stringify(event));

  const productId = event.pathParameters?.productId;

  if (!productId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'productId is not valid' }),
    };
  }
  try {
    const products = await getProductsListMock();
    const product = products.find((product) => product.id === productId);

    if (!product) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Product not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Something went wrong' }),
    };
  }
};
