import { S3Event, S3Handler } from 'aws-lambda';

import { ImportServiceInterface } from '@/services/importService';
import { Product } from '@/types/products';

export const importFileParser =
  (importService: ImportServiceInterface<Product>): S3Handler =>
  async (event: S3Event) => {
    console.log('Lambda invocation with event: ', JSON.stringify(event));

    try {
      await Promise.all(
        event.Records.map(async (record) => {
          const fileName = record.s3.object.key;

          console.log('Start file parsing: ', fileName);

          await importService.parseUploadedFile(fileName);

          console.log('File parsed successfully!');
        })
      );
    } catch (e) {
      console.log('An error occured while parsing the file', e);
    }
  };
