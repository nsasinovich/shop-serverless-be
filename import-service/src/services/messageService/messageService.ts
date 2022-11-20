import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs';

import MessageServiceInterface from './messageServiceInterface';

class MessageService<T extends { id: string }> implements MessageServiceInterface<T> {
  private static readonly MAX_BATCH_SIZE = 10;

  constructor(private readonly sqsUrl: string, private readonly sqsClient: SQSClient) {}

  async sendMessages(entries: T[]): Promise<void> {
    const batches: T[][] = this.splitByBatches(entries);

    await Promise.all(batches.map(async (batch) => this.sendMessageBatch(batch)));
  }

  private async sendMessageBatch(batch: T[]) {
    const batchEntries = batch.map((entry) => ({
      Id: entry.id,
      MessageBody: JSON.stringify(entry),
    }));

    const command = new SendMessageBatchCommand({
      QueueUrl: this.sqsUrl,
      Entries: batchEntries,
    });

    const result = await this.sqsClient.send(command);

    console.log('Batch message result: ', result);

    return result;
  }

  private splitByBatches(entries: T[]): T[][] {
    const batches: T[][] = [];

    for (let i = 0; i < entries.length; i += MessageService.MAX_BATCH_SIZE) {
      const batch = entries.slice(i, i + MessageService.MAX_BATCH_SIZE);
      batches.push(batch);
    }

    return batches;
  }
}

export default MessageService;
