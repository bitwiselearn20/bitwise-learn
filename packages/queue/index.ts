import type { HandlerCB, Queue } from "./type";
import * as amqp from "amqplib";

class RabbitMQ implements Queue {
  uri: string;
  connection!: amqp.ChannelModel;
  channel!: amqp.Channel;
  connected!: Boolean;

  constructor(uri: string) {
    this.uri = uri;
  }

  async connect() {
    if (this.connected && this.channel) return;

    try {
      console.log(`Initializing Connection `);
      this.connection = await amqp.connect(this.uri);

      console.log(`Queue System configured`);
      console.log(`Initialising Queue Channel`);
      this.channel = await this.connection.createChannel();

      this.connected = true;
      console.log(`Queue Channel Established`);
    } catch (error) {
      console.error(error);
      console.error(`Queue Initialization Failed`);
      throw error;
    }
  }
  async registerNewChannel(
    queueName: string,
  ): Promise<amqp.Replies.AssertQueue> {
    if (!this.connected) {
      await this.connect();
    }

    const existingQueue = await this.channel.checkQueue(queueName);
    if (existingQueue) {
      throw new Error("Active Queue by the name: " + queueName);
    }

    const createQueue = await this.channel.assertQueue(queueName);
    return createQueue;
  }
  async sendToQueue(queueName: string, message: any): Promise<Boolean> {
    if (!this.connected) {
      await this.connect();
    }

    await this.channel.assertQueue(queueName, {
      durable: true,
    });

    try {
      const res = await this.channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(message)),
      );

      return res;
    } catch (error: any) {
      console.log("QUEUE_PUSH_ERROR:" + error);
    }

    return true;
  }
  async consumeFromQueue(queueName: string, cb: HandlerCB) {
    if (!this.connected || !this.channel) {
      await this.connect();
    }

    await this.channel.assertQueue(queueName, {
      durable: true,
    });

    await this.channel.prefetch(1);

    await this.channel.consume(
      queueName,
      async (msg) => {
        if (!msg) {
          console.error("Consumer cancelled or invalid message");
          return;
        }

        try {
          const payload = msg.content.toString();
          await cb(payload);

          this.channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);

          this.channel.nack(msg, false, true);
        }
      },
      {
        noAck: false,
      },
    );

    console.log(`Consuming from queue: ${queueName}`);
  }
}

export default function connectMQ(uri: string): Queue {
  return new RabbitMQ(uri);
}
export type { HandlerCB, Queue } from "./type";
