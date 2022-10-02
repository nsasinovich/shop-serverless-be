export interface Product {
  title: string;
  id: string;
  price: number;
  count: number;
  description: string;
  imageUrl?: string;
}

type ProductData = Omit<Product, 'id'>;

export interface ProductProviderInterface {
  getProductById: (id: string) => Promise<Product>;
  getProducts: () => Promise<Product[]>;
  createProduct: (product: ProductData) => Promise<Product>;
}
