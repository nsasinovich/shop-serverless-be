import { S3Client } from '@aws-sdk/client-s3';

import * as handlers from '@/functions';
import { ImportService } from '@/services/importService';

const { BUCKET_REGION, BUCKET_NAME = '' } = process.env;

const s3Client = new S3Client({ region: BUCKET_REGION });
const importService = new ImportService(s3Client, BUCKET_NAME);

export const importProductsFile = handlers.importProductsFile(importService);
