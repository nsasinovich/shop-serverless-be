import csv from 'csv-parser';
import { Readable } from 'stream';

import FileParserInterface, { ValuesMapper } from './FileParserInterface';

class FileParser<T> implements FileParserInterface<T> {
  public parseFileStream(fileStream: Readable, valuesMapper?: ValuesMapper): Promise<T[]> {
    const parsedData: T[] = [];

    return new Promise((resolve, reject) => {
      fileStream
        .pipe(csv({ mapValues: valuesMapper }))
        .on('error', () => reject('Error while parsing the stream'))
        .on('data', (item) => {
          console.log('Parsed file entry: ', item);

          return parsedData.push(item as T);
        })
        .on('end', () => resolve(parsedData));
    });
  }
}

export default FileParser;
