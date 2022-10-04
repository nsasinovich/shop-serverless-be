import { S3Client } from '@aws-sdk/client-s3';

import { ImportService } from '@/services/importService';
import { FileParser } from '@/services/fileParserService';

import { Product } from '@/types/products';
import * as handlers from '@/functions';

const { BUCKET_REGION, BUCKET_NAME = '' } = process.env;

const s3Client = new S3Client({ region: BUCKET_REGION });
const productFileParser = new FileParser<Product>();

const productImportService = new ImportService<Product>(BUCKET_NAME, s3Client, productFileParser);

export const importProductsFile = handlers.importProductsFile(productImportService);
export const importFileParser = handlers.importFileParser(productImportService);
