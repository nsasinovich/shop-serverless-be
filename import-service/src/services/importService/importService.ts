import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

import ImportServiceInterface from './ImportServiceInterface';
import { FileParserInterface } from '@/services/fileParserService';

const UPLOADED_FOLDER_NAME = 'uploaded';
const EXPIRATION_DEFAULT = 60;

class ImportService<T> implements ImportServiceInterface<T> {
  constructor(
    private readonly bucketName: string,
    private readonly s3Client: S3Client,
    private readonly fileParser: FileParserInterface<T>
  ) {}

  public createUploadUrl(fileName: string): Promise<string> {
    const putObjectParams = {
      Bucket: this.bucketName,
      Key: `${UPLOADED_FOLDER_NAME}/${fileName}`,
    };
    const command = new PutObjectCommand(putObjectParams);

    return getSignedUrl(this.s3Client, command, { expiresIn: EXPIRATION_DEFAULT });
  }

  public async parseUploadedFile(fileName: string): Promise<T[]> {
    const getObjectParams = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    const command = new GetObjectCommand(getObjectParams);

    const response = await this.s3Client.send(command);
    const fileStream = response.Body as Readable | null;

    if (!fileStream) {
      return Promise.reject(`File not found: ${fileName}`);
    }

    return this.fileParser.parseFileStream(fileStream);
  }
}

export default ImportService;
