import csv from 'csv-parser';
import { Readable } from 'stream';

import FileParserInterface from './FileParserInterface';

class FileParser<T> implements FileParserInterface<T> {
  public parseFileStream(fileStream: Readable): Promise<T[]> {
    const parsedData: T[] = [];

    return new Promise((resolve, reject) => {
      fileStream
        .pipe(csv())
        .on('error', () => reject('Error while parsing the stream'))
        .on('data', (item) => parsedData.push(item as T))
        .on('end', () => resolve(parsedData));
    });
  }
}

export default FileParser;
