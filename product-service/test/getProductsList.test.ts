import { APIGatewayProxyEvent } from 'aws-lambda';
import { getProductsList } from '@functions/getProductsList';
import productsListMock from '@mocks/productsListMock';

describe('#getProductsList', () => {
  const mockEvent = {} as APIGatewayProxyEvent;

  it('should return products list', async () => {
    const result = await getProductsList(mockEvent);

    expect(result.body).toEqual(JSON.stringify(productsListMock));
    expect(result.statusCode).toEqual(200);
  });
});
