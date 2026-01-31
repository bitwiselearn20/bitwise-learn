import "dotenv/config";
import dotenv from "dotenv";
import MQClient from "./utils/queueClient";
import assessmentProcessing from "./utils/assessment-processing";
import { endAssessment } from "./utils/end-assessment";
import cron from "node-cron";

dotenv.config({ path: "../.env" });

function startServer() {
  if (MQClient.connected) {
    MQClient.consumeFromQueue("assessment-report", assessmentProcessing);
  }
}

MQClient.connect()
  .then(() => {
    startServer();
  })
  .catch((err: any) => {
    console.log(err);
    process.exit(1);
  });
