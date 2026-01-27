import connectMQ from "@bitwiselearn/queue";
export default connectMQ(process.env.MQ_CLIENT!);
