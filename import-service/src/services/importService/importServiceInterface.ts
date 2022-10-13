export default interface ImportServiceInterface<T> {
  createUploadUrl(fileName: string): Promise<string>;
  parseUploadedFile(fileName: string): Promise<T[]>;
}
