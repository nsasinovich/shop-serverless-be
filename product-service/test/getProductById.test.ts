import { APIGatewayProxyEvent } from 'aws-lambda';
import { getProductById } from '@/functions/getProductById';

describe('#getProductById', () => {
  it('should return product with the provided productId', async () => {
    const mockEvent = {
      pathParameters: {
        productId: '17bbdb2b-a964-429d-953e-4a8f7bd3373c',
      },
    } as unknown as APIGatewayProxyEvent;

    const result = await getProductById(mockEvent);

    expect(result).toEqual({
      body: JSON.stringify({
        title: 'Powerslide NEXT 100',
        id: '17bbdb2b-a964-429d-953e-4a8f7bd3373c',
        price: 200,
        description: 'Short Product Description',
        imageUrl:
          'https://www.tradeinn.com/f/13860/138604965/powerslide-next-grey-100-banan-marakuja.jpg',
      }),
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
    });
  });

  it('should return 400 error if productId is not valid', async () => {
    const mockEvent = { pathParameters: null } as unknown as APIGatewayProxyEvent;

    const result = await getProductById(mockEvent);

    expect(result.statusCode).toEqual(400);
  });

  it('should return 404 error if product with provided id is not found', async () => {
    const mockEvent = {
      pathParameters: {
        productId: '12345',
      },
    } as unknown as APIGatewayProxyEvent;

    const result = await getProductById(mockEvent);

    expect(result.statusCode).toEqual(404);
  });
});
