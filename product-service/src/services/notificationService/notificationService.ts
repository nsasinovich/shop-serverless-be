import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

import NotificationServiceInterface, { Notification } from './notificationServiceInterface';

class NotificationService implements NotificationServiceInterface {
  constructor(private readonly snsArn: string, private readonly snsClient: SNSClient) {}

  async publishMessage(notification: Notification): Promise<void> {
    const { message, subject } = notification;

    const command = new PublishCommand({
      Subject: subject,
      Message: message,
      TopicArn: this.snsArn,
    });

    try {
      await this.snsClient.send(command);

      console.log('Message published: ', notification);
    } catch (e) {
      console.log('Message publish error: ', e);
    }
  }
}

export default NotificationService;
