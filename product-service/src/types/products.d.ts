export interface Product {
  title: string;
  id: string;
  price: number;
  description: string;
  imageUrl?: string;
}

export interface ProductProviderInterface {
  getProductById: (id: string) => Promise<Product>;
  getProducts: () => Promise<Product[]>;
}
