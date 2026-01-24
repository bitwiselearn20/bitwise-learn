import React from "react";
import AssignmentV1 from "./v1/AssignmentV1";

export default function Assignment({ assignmentId }: { assignmentId: string }) {
  return <AssignmentV1 assignmentId={assignmentId} />;
}
