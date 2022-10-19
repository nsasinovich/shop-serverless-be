import { APIGatewayProxyEvent } from 'aws-lambda';
import { mock, mockReset } from 'jest-mock-extended';

import { importProductsFile as importProductsFileFactory } from '@/functions';
import { ImportService } from '@/services/importService';
import { Product } from '@/types/products';

describe('#importProductsFile', () => {
  const importServiceMock = mock<ImportService<Product>>();
  const importProductsFile = importProductsFileFactory(importServiceMock);

  afterEach(() => {
    mockReset(importServiceMock);
  });

  it('should return 400 error if filename is not provided', async () => {
    const apiGatewayEvent = { queryStringParameters: {} } as unknown as APIGatewayProxyEvent;

    const result = await importProductsFile(apiGatewayEvent);

    expect(result.statusCode).toBe(400);
  });

  it('should return 500 error if signed url creation is failed', async () => {
    const apiGatewayEvent = {
      queryStringParameters: {
        name: 'test-name',
      },
    } as unknown as APIGatewayProxyEvent;

    importServiceMock.createUploadUrl.mockRejectedValueOnce(null);

    const result = await importProductsFile(apiGatewayEvent);

    expect(result.statusCode).toBe(500);
  });

  it('should return created upload url', async () => {
    const fileName = 'test-file';
    const resultUrl = 'http://folder/test-file';
    const apiGatewayEvent = {
      queryStringParameters: {
        name: fileName,
      },
    } as unknown as APIGatewayProxyEvent;

    importServiceMock.createUploadUrl.mockResolvedValueOnce(resultUrl);

    const result = await importProductsFile(apiGatewayEvent);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(resultUrl));
  });
});
