import prismaClient from "@bitwiselearn/prisma";
import * as XLSX from "xlsx";
import path from "path";
import { uploadToCloudinary } from "./file-upload";

/** Sleep helper */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function assessmentProcessing(payload: { id: string }) {
  const BATCH_SIZE = 50;
  let lastId: string | null = null;
  let hasMore = true;

  const rows: any[] = [];

  while (hasMore) {
    const submissions: any = await prismaClient.assessmentSubmission.findMany({
      take: BATCH_SIZE,
      ...(lastId && {
        skip: 1,
        cursor: { id: lastId },
      }),
      where: {
        assessmentId: payload.id,
        isSubmitted: true,
      },
      orderBy: {
        id: "asc",
      },
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
        assessmentQuestionSubmissions: {
          include: {
            question: {
              include: {
                section: true,
              },
            },
          },
        },
      },
    });

    if (submissions.length === 0) {
      hasMore = false;
      break;
    }

    for (const submission of submissions) {
      const questionSubs = submission.assessmentQuestionSubmissions;

      let solved = 0;
      let partiallySolved = 0;
      let notSolved = 0;
      let totalPossibleMarks = 0;

      for (const qs of questionSubs) {
        const maxMarks =
          qs.question.section.marksPerQuestion ?? qs.question.maxMarks ?? 0;

        totalPossibleMarks += maxMarks;

        if (!qs.marksObtained) {
          notSolved++;
        } else if (qs.marksObtained === maxMarks) {
          solved++;
        } else {
          partiallySolved++;
        }
      }

      const totalPercentage =
        totalPossibleMarks > 0
          ? ((submission.totalMarks ?? 0) / totalPossibleMarks) * 100
          : 0;

      const timeSpent =
        submission.submittedAt && submission.startedAt
          ? Math.floor(
              (new Date(submission.submittedAt).getTime() -
                new Date(submission.startedAt).getTime()) /
                1000,
            )
          : null;

      rows.push({
        Name: submission.student.name,
        Email: submission.student.email,
        RegisterId: submission.student.batchId,
        Institution: submission.student.instituteId,
        "Batch Year": submission.student.batch?.batchEndYear,
        Batch: submission.student.batch?.batchname ?? "",
        Status: submission.isSubmitted ? "SUBMITTED" : "NOT_SUBMITTED",
        TotalScore: submission.totalMarks ?? 0,
        TotalQuestionsSolved: solved,
        TotalQuestionsPartiallySolved: partiallySolved,
        TotalQuestionsNotSolved: notSolved,
        TotalPercentage: totalPercentage.toFixed(2),
        OverallQualifingStatus:
          totalPercentage >= 40 ? "QUALIFIED" : "NOT_QUALIFIED",
        OverallTimeSpent: timeSpent,
        TabSwitchCount:
          submission.tabSwitchCount > 0
            ? submission.tabSwitchCount === 3
              ? "MALPRACTICE"
              : "SUSPICIOUS"
            : "CLEAN",
        ProctorMonitor: submission.proctoringStatus,
        Attemptedon: submission.startedAt,
        "IP Address": submission.studentIp,
      });
    }

    lastId = submissions[submissions.length - 1].id;

    // 💤 Sleep 5–10 seconds after each batch
    const delay = Math.floor(Math.random() * (10_000 - 5_000 + 1)) + 5_000;

    console.log(`Processed ${rows.length} records. Sleeping ${delay / 1000}s…`);
    await sleep(delay);
  }

  rows.sort((a, b) => (b.TotalScore ?? 0) - (a.TotalScore ?? 0));
  rows.forEach((row, index) => {
    row.Ranking = index + 1;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Assessment Results");

  const filePath = path.join(process.cwd(), `assessment_${payload.id}.xlsx`);

  XLSX.writeFile(workbook, filePath);

  console.log("Excel file created:", filePath);
  const uploadData = await uploadToCloudinary(filePath);

  await prismaClient.assessment.update({
    where: { id: payload.id },
    data: {
      report: uploadData.url,
      reportStatus: "PROCESSED",
    },
  });

  return filePath;
}
