import { Product } from 'src/types/products';
import productsListMock from './productsListMock';

export const getProductsListMock = (): Promise<Product[]> => Promise.resolve(productsListMock);
