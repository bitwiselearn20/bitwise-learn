import * as amqp from "amqplib";

export interface Queue {
  uri: string | any;
  connection: amqp.ChannelModel;
  channel: amqp.Channel;
  connected: Boolean;
  connect: () => Promise<void>;
  registerNewChannel: (queueName: string) => Promise<amqp.Replies.AssertQueue>;
  sendToQueue: (queueName: string, message: any) => Promise<Boolean>;
  consumeFromQueue: (queueName: string, cb: HandlerCB) => Promise<void>;
}

export type HandlerCB = (msg: string) => any;
