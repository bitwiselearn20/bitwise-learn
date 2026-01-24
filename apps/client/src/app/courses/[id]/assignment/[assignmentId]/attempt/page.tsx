import Attempt from "@/component/attempt/Attempt";
import React from "react";

export default async function AttemptPage({
  params,
}: {
  params: { assignmentId: string; id: string };
}) {
  const { assignmentId, id } = await params;
  console.log("assignmentId", assignmentId);
  return <Attempt assignmentId={assignmentId} />;
}
