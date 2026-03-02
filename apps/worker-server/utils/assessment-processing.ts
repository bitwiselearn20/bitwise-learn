import prismaClient from "@bitwiselearn/prisma";
import * as XLSX from "xlsx";
import path from "path";
import uploadFile from "./file-upload";
import fs from "fs/promises";

/** Sleep helper */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function assessmentProcessing(payload: string) {
  const assessment = JSON.parse(payload);
  try {
    const BATCH_SIZE = 50;

    let lastId: string | null = null;
    let hasMore = true;

    const rows: any[] = [];
    const dbAssessment = await prismaClient.assessment.findUnique({
      where: { id: assessment.id },
      select: {
        startTime: true,
        sections: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!dbAssessment) {
      throw new Error("Assessment not found");
    }
    const assessmentTotalMarks = dbAssessment.sections.reduce(
      (sum, section) =>
        sum +
        section.questions.reduce(
          (qSum, q) => qSum + (q.maxMarks ?? section.marksPerQuestion ?? 0),
          0,
        ),
      0,
    );

    const assessmentTotalQuestions = dbAssessment.sections.reduce(
      (sum, section) => sum + section.questions.length,
      0,
    );

    while (hasMore) {
      const submissions: any = await prismaClient.assessmentSubmission.findMany(
        {
          take: BATCH_SIZE,
          ...(lastId && {
            skip: 1,
            cursor: { id: lastId },
          }),
          where: {
            assessmentId: assessment.id,
            isSubmitted: true,
          },
          orderBy: { id: "asc" },
          include: {
            student: {
              select: {
                name: true,
                email: true,
                instituteId: true,
                batchId: true,
                batch: true,
              },
            },
          },
        },
      );

      if (submissions.length === 0) {
        hasMore = false;
        break;
      }

      for (const submission of submissions) {
        const questionSubs =
          await prismaClient.assessmentQuestionSubmission.findMany({
            where: {
              assessmentId: submission.assessmentId,
              studentId: submission.studentId,
            },
            include: {
              question: {
                include: {
                  section: true,
                },
              },
            },
          });

        let correct = 0;
        let incorrect = 0;

        for (const qs of questionSubs) {
          const maxMarks =
            qs.question.maxMarks ?? qs.question.section.marksPerQuestion ?? 0;

          if (qs.marksObtained === maxMarks) {
            correct++;
          } else if (qs.marksObtained > 0 || qs.marksObtained === 0) {
            incorrect++;
          }
        }

        const totalMarks = submission.totalMarks ?? 0;

        const totalPercentage =
          assessmentTotalMarks > 0
            ? (totalMarks / assessmentTotalMarks) * 100
            : 0;

        const startTime = new Date(dbAssessment.startTime + "+05:30");
        // const totalTimeSpent = submission.createdAt
        //   ? Number(
        //       (
        //         (submission.startedAt.getTime() - startTime.getTime()) /
        //         (1000 * 60)
        //       ).toFixed(2),
        //     )
        //   : null;

        rows.push({
          Name: submission.student.name,
          Email: submission.student.email,
          BatchId: submission.student.batchId,
          Institution: submission.student.instituteId,
          "Batch Year": submission.student.batch?.batchEndYear,
          Batch: submission.student.batch?.batchname ?? "",
          Status: "SUBMITTED",
          TotalScore: totalMarks,
          Correct: correct,
          Incorrect: incorrect,
          TotalQuestionsNotSolved:
            assessmentTotalQuestions - correct - incorrect,
          TotalPercentage: Number(totalPercentage.toFixed(2)),
          OverallQualifingStatus:
            totalPercentage >= 40 ? "QUALIFIED" : "NOT_QUALIFIED",
          // OverallTimeSpent: totalTimeSpent,
          TabSwitchCount: submission.tabSwitchCount,
          ProctorMonitor: submission.proctoringStatus,
          Attemptedon: submission.submittedAt,
          "IP Address": submission.studentIp,
        });
      }

      lastId = submissions[submissions.length - 1].id;

      const delay = Math.floor(Math.random() * 6000) + 5000;
      console.log(
        `Processed ${rows.length} records. Sleeping ${delay / 1000}s…`,
      );

      await sleep(delay);
    }

    rows.sort((a, b) => (b.TotalScore ?? 0) - (a.TotalScore ?? 0));
    rows.forEach((row, index) => {
      row.Ranking = index + 1;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assessment Results");

    const filePath = path.join(
      process.cwd(),
      `assessment_${assessment.id}.xlsx`,
    );

    XLSX.writeFile(workbook, filePath);

    const uploadData = await uploadFile(filePath);

    if (!uploadData) throw new Error("file upload failed");
    await prismaClient.assessment.update({
      where: { id: assessment.id },
      data: {
        report: uploadData,
        reportStatus: "PROCESSED",
      },
    });

    await fs.unlink(
      path.join(process.cwd(), `assessment_${assessment.id}.xlsx`),
    );
    console.log("Assessment report generated successfully");
    return filePath;
  } catch (error) {
    console.error("Assessment processing failed:", error);
    await fs.unlink(
      path.join(process.cwd(), `assessment_${assessment.id}.xlsx`),
    );
    throw error;
  }
}
