import { Context, SQSEvent } from 'aws-lambda';
import { mock, mockReset } from 'jest-mock-extended';

import { catalogBatchProcess as catalogBatchProcessFactory } from '@/functions';
import { ProductProvider } from '@/providers/productProvider';
import { NotificationService } from '@/services/notificationService';

const mockProducts = [
  { title: 'Test Title', price: 240, count: 20, description: 'Test' },
  { title: 'Test Title 2', price: 10, count: 3, description: 'Test description' },
];

describe('#catalogBatchProcess', () => {
  const productProviderMock = mock<ProductProvider>();
  const notificationServiceMock = mock<NotificationService>();
  const contextMock = mock<Context>();

  const sqsEventMock = {
    Records: mockProducts.map((productMock) => ({ body: JSON.stringify(productMock) })),
  } as unknown as SQSEvent;

  const catalogBatchProcess = catalogBatchProcessFactory(
    productProviderMock,
    notificationServiceMock
  );

  afterEach(() => {
    mockReset(productProviderMock);
    mockReset(notificationServiceMock);
  });

  it('should create product for each Record in the passed event', async () => {
    await catalogBatchProcess(sqsEventMock, contextMock, () => undefined);

    expect(productProviderMock.createProduct).toBeCalledTimes(2);
  });

  it('should send success notification for each created product', async () => {
    await catalogBatchProcess(sqsEventMock, contextMock, () => undefined);

    expect(notificationServiceMock.publishMessage).toBeCalledTimes(2);
    notificationServiceMock.publishMessage.mock.calls.forEach(([messageArg]) => {
      expect(messageArg).toHaveProperty('subject', 'Product added');
      expect(messageArg).toHaveProperty('attributes');
    });
  });

  it('should send error notification for each failed to create product', async () => {
    productProviderMock.createProduct.mockRejectedValue(null);

    await catalogBatchProcess(sqsEventMock, contextMock, () => undefined);

    expect(notificationServiceMock.publishMessage).toBeCalledTimes(2);
    notificationServiceMock.publishMessage.mock.calls.forEach(([messageArg]) => {
      expect(messageArg).toHaveProperty('subject', 'Failed to add product');
      expect(messageArg).not.toHaveProperty('attributes');
    });
  });

  it('should not throw if failed to create one of the products', async () => {
    productProviderMock.createProduct.mockRejectedValueOnce(null);

    const result = await catalogBatchProcess(sqsEventMock, contextMock, () => undefined);

    expect(result).resolves;
  });
});
