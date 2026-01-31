import React from "react";
import AttemptAssignmentV1 from "./v1/AttemptAssignmentV1";

function AttemptAssignment({ assignmentId }: { assignmentId: string }) {
  console.log("loading assignment " + assignmentId);
  return <AttemptAssignmentV1 assignmentId={assignmentId} />;
}

export default AttemptAssignment;
