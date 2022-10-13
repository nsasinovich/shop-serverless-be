import { NotificationServiceInterface } from '@/services/notificationService';
import { Product, ProductProviderInterface } from '@/types/products';
import { SQSEvent, SQSHandler } from 'aws-lambda';

export const catalogBatchProcess =
  (
    productProvider: ProductProviderInterface,
    notificationService: NotificationServiceInterface
  ): SQSHandler =>
  async (event: SQSEvent) => {
    console.log('Lambda invocation with event: ', JSON.stringify(event));

    const products: Product[] = event.Records.map((record) => JSON.parse(record.body) as Product);

    console.log('Products parsed: ', JSON.stringify(products));

    await Promise.all(
      products.map(async (product) => {
        const serialized = JSON.stringify(product);

        try {
          await productProvider.createProduct(product);

          console.log('Product created successfully: ', product.id);

          await notificationService.publishMessage({
            subject: 'Product added',
            message: serialized,
          });
        } catch (e) {
          console.log('Error while creating the product: ', product.id, e);

          await notificationService.publishMessage({
            subject: 'Failed to add product',
            message: serialized,
          });
        }
      })
    );
  };
