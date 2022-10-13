export interface Notification {
  message: string | undefined;
  subject: string | undefined;
}

export default interface NotificationServiceInterface {
  publishMessage(notification: Notification): Promise<void>;
}
