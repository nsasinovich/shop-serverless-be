import { getProductsListMock } from '@/mocks/getProductsListMock';
import { Product, ProductProviderInterface } from '@/types/products';

class ProductProvider implements ProductProviderInterface {
  async getProductById(id: string): Promise<Product> {
    const products = await getProductsListMock();

    return products.find((product) => product.id === id);
  }

  async getProducts(): Promise<Product[]> {
    return getProductsListMock();
  }
}

export default ProductProvider;
