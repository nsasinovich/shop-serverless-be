import { S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';

import { ImportService } from '@/services/importService';
import { FileParser } from '@/services/fileParserService';
import { MessageService } from '@/services/messageService';

import { Product } from '@/types/products';
import * as handlers from '@/functions';

const { REGION, SQS_URL = '', BUCKET_NAME = '' } = process.env;

console.log('SQS_URL: ', SQS_URL);
console.log('BUCKET_NAME: ', BUCKET_NAME);

const s3Client = new S3Client({ region: REGION });
const sqsClient = new SQSClient({ region: REGION });

const productFileParser = new FileParser<Product>();
const productMessageService = new MessageService<Product>(SQS_URL, sqsClient);
const productImportService = new ImportService<Product>(
  BUCKET_NAME,
  s3Client,
  productFileParser,
  productMessageService
);

export const importProductsFile = handlers.importProductsFile(productImportService);
export const importFileParser = handlers.importFileParser(productImportService);
