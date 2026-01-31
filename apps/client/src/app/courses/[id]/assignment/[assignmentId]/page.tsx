"use client";
import AttemptAssignment from "@/component/courses/AttempAssignment/AttemptAssignment";

export default async function StartAssignmentPgae({
  params,
}: {
  params: { assignmentId: string };
}) {
  const { assignmentId } = await params;
  console.log("this is assignment");
  return <AttemptAssignment assignmentId={assignmentId} />;
}
