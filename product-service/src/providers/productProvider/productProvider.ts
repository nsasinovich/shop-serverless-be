import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ProductData, Product, ProductProviderInterface } from '@/types/products';

class ProductProvider implements ProductProviderInterface {
  private readonly dbClient: DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor(dbClient: DynamoDB.DocumentClient, tableName: string) {
    this.dbClient = dbClient;
    this.tableName = tableName;
  }

  async getProductById(id: string): Promise<Product> {
    const params = {
      TableName: this.tableName,
      Key: { id },
    };

    const data = await this.dbClient.get(params).promise();

    return data.Item as Product;
  }

  async getProducts(): Promise<Product[]> {
    const params = {
      TableName: this.tableName,
    };

    const data = await this.dbClient.scan(params).promise();

    return data.Items as Product[];
  }

  async createProduct(productData: ProductData): Promise<Product> {
    const product: Product = {
      id: uuidv4(),
      ...productData,
    };

    const params = {
      TableName: this.tableName,
      Item: product,
    };

    await this.dbClient.put(params).promise();

    return product;
  }
}

export default ProductProvider;
