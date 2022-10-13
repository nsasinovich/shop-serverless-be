import { Readable } from 'stream';

export interface ValuesMapper {
  ({ header, value }: { header: string; value: string }): string | unknown;
}

export default interface FileParserInterface<T> {
  parseFileStream(fileStream: Readable, valuesMapper?: ValuesMapper): Promise<T[]>;
}
