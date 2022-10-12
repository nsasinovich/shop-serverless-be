import { Product, ProductProviderInterface } from '@/types/products';
import { SQSEvent, SQSHandler } from 'aws-lambda';

export const catalogBatchProcess =
  (productProvider: ProductProviderInterface): SQSHandler =>
  async (event: SQSEvent) => {
    console.log('Lambda invocation with test event: ', JSON.stringify(event));

    const products: Product[] = event.Records.map((record) => JSON.parse(record.body) as Product);

    console.log('Products parsed: ', JSON.stringify(products));

    try {
      await Promise.all(products.map((product) => productProvider.createProduct(product)));

      console.log('Products created sucessfully!');
    } catch (e) {
      console.log('Error while creating the products:', e);
    }
  };
