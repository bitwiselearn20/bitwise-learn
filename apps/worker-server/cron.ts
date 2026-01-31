import { startAssessment, endAssessment } from "./utils/end-assessment";
import prismaClient from "./utils/prisma";

async function run() {
  try {
    console.log("Assessment cron started");

    await startAssessment();
    await endAssessment();

    console.log("Assessment cron finished");
  } catch (err) {
    console.error("Assessment cron failed:", err);
    process.exit(1);
  } finally {
    await prismaClient.$disconnect();
    process.exit(0);
  }
}

run();

// */30 * * * * node /app/runAssessmentCron.js >> /var/log/assessment-cron.log 2>&1
