export default interface ImportServiceInterface {
  createUploadUrl(fileName: string): Promise<string>;
}
