import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import ImportServiceInterface from './ImportServiceInterface';

const UPLOADED_FOLDER_NAME = 'uploaded';
const EXPIRATION_DEFAULT = 60;

class ImportService implements ImportServiceInterface {
  constructor(private readonly s3Client: S3Client, private readonly bucketName: string) {}

  public createUploadUrl(fileName: string): Promise<string> {
    const putObjectParams = {
      Bucket: this.bucketName,
      Key: `${UPLOADED_FOLDER_NAME}/${fileName}`,
    };
    const command = new PutObjectCommand(putObjectParams);

    return getSignedUrl(this.s3Client, command, { expiresIn: EXPIRATION_DEFAULT });
  }
}

export default ImportService;
