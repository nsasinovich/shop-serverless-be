export interface MessageAttribute {
  DataType: string;
  StringValue: string;
}
export interface Notification {
  message: string | undefined;
  subject: string | undefined;
  attributes?: Record<string, MessageAttribute>;
}

export default interface NotificationServiceInterface {
  publishMessage(notification: Notification): Promise<void>;
}
