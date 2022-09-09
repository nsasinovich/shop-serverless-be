import * as handlers from '@/functions';
import { ProductProvider } from '@/providers/productProvider';

console.log(process.env);

const productProvider = new ProductProvider();

export const getProductsList = handlers.getProductsList(productProvider);
export const getProductById = handlers.getProductById(productProvider);
