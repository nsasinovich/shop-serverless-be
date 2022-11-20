export default interface MessageServiceInterface<T> {
  sendMessages(entries: T[]): Promise<void>;
}
