import { JSONSchemaType } from 'ajv';
import { ProductData } from '@/types/products';

export const CreateProductRequestSchema: JSONSchemaType<ProductData> = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    count: { type: 'integer' },
    imageUrl: { type: 'string', nullable: true },
  },
  required: ['title', 'description', 'price', 'count'],
};
