import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

import ImportServiceInterface from './ImportServiceInterface';
import { FileParserInterface, ValuesMapper } from '@/services/fileParserService';
import { MessageServiceInterface } from '@/services/messageService';

const UPLOADED_FOLDER_NAME = 'uploaded';
const PARSED_FOLDER_NAME = 'parsed';
const EXPIRATION_DEFAULT = 60;

class ImportService<T> implements ImportServiceInterface<T> {
  constructor(
    private readonly bucketName: string,
    private readonly s3Client: S3Client,
    private readonly fileParser: FileParserInterface<T>,
    private readonly messageService: MessageServiceInterface<T>
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

    const valuesMapper: ValuesMapper = ({ header, value }: { header: string; value: string }) =>
      ['count', 'price'].includes(header) ? Number(value) : value;

    const parsedFile = await this.fileParser.parseFileStream(fileStream, valuesMapper);

    try {
      const targetFileName = fileName.replace(UPLOADED_FOLDER_NAME, PARSED_FOLDER_NAME);

      await this.copyFile(fileName, targetFileName);
      await this.deleteFile(fileName);
    } catch (e) {
      console.log('Failed to move file: ', fileName, e);
    }

    try {
      await this.messageService.sendMessages(parsedFile);
    } catch (e) {
      console.log('An error occured while sending the messages ', e);
    }

    return parsedFile;
  }

  private async copyFile(fileName: string, targetFileName: string): Promise<void> {
    const copyObjectParams = {
      Bucket: this.bucketName,
      CopySource: `${this.bucketName}/${fileName}`,
      Key: targetFileName,
    };

    const command = new CopyObjectCommand(copyObjectParams);

    await this.s3Client.send(command);

    console.log(`File moved succesfully: ${fileName} -> ${targetFileName}`);
  }

  private async deleteFile(fileName: string): Promise<void> {
    const deleteObjectParams = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    const command = new DeleteObjectCommand(deleteObjectParams);

    await this.s3Client.send(command);

    console.log(`File deleted succesfully: ${fileName}`);
  }
}

export default ImportService;
