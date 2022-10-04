import { Readable } from 'stream';

export default interface FileParserInterface<T> {
  parseFileStream(fileStream: Readable): Promise<T[]>;
}
