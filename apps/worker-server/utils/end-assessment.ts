import prismaClient from "./prisma";

export async function endAssessment() {
  await prismaClient.assessment.updateMany({
    where: {
      status: "LIVE",
      endTime: {
        lte: new Date(),
      },
    },
    data: {
      status: "ENDED",
    },
  });
}
export async function startAssessment() {
  await prismaClient.assessment.updateMany({
    where: {
      status: "UPCOMING",
      endTime: {
        gte: new Date(),
      },
    },
    data: {
      status: "LIVE",
    },
  });
}
