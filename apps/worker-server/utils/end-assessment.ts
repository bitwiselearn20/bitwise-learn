import prismaClient from "./prisma";

export async function endAssessment() {
  const assessmentToEnd = await prismaClient.assessment.findMany({
    where: {
      status: "LIVE",
      endTime: {
        lte: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      },
    },
    include: {
      batch: {
        include: {
          students: true,
        },
      },
    },
  });

  for (let i = 0; i < assessmentToEnd.length; i++) {
    const assessment = assessmentToEnd[i];
    await handleAssessmentEnd(assessment);
  }
}

async function handleAssessmentEnd(assessment: any) {
  const students = assessment.batch.students;

  for (const student of students) {
    const existingSubmission =
      await prismaClient.assessmentSubmission.findUnique({
        where: {
          assessmentId_studentId: {
            assessmentId: assessment.id,
            studentId: student.id,
          },
        },
      });

    if (!existingSubmission) {
      await autoSubmitAssessment(assessment.id, student.id);
    }
  }

  // Finally mark assessment as ENDED
  await prismaClient.assessment.update({
    where: { id: assessment.id },
    data: { status: "ENDED" },
  });
}

async function autoSubmitAssessment(assessmentId: string, studentId: string) {
  const questionSubmissions =
    await prismaClient.assessmentQuestionSubmission.findMany({
      where: {
        studentId,
        assessmentId,
      },
    });

  const totalMarks = questionSubmissions.reduce((acc, submission) => {
    return acc + (submission.marksObtained || 0);
  }, 0);

  await prismaClient.assessmentSubmission.create({
    data: {
      assessmentId,
      studentId,
      studentIp: "AUTO_SUBMITTED",
      tabSwitchCount: 0,
      proctoringStatus: "NOT_CHEATED",
      isSubmitted: true,
      totalMarks,
      submittedAt: new Date(),
    },
  });
}

export async function startAssessment() {
  await prismaClient.assessment.updateMany({
    where: {
      status: "UPCOMING",
      endTime: {
        gte: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      },
    },
    data: {
      status: "LIVE",
    },
  });
}
