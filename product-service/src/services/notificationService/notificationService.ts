import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

import NotificationServiceInterface, { Notification } from './notificationServiceInterface';

class NotificationService implements NotificationServiceInterface {
  constructor(private readonly snsArn: string, private readonly snsClient: SNSClient) {}

  async publishMessage(notification: Notification): Promise<void> {
    const { message, subject, attributes } = notification;

    const command = new PublishCommand({
      Subject: subject,
      TopicArn: this.snsArn,
      Message: message,
      MessageAttributes: attributes,
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
