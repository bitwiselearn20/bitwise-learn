import Assignment from "@/component/assignment/Assignment";
import React from "react";

export default async function StartAssignmentPgae({
  params,
}: {
  params: { assignmentId: string };
}) {
  const { assignmentId } = await params;
  return <Assignment assignmentId={assignmentId} />;
}
