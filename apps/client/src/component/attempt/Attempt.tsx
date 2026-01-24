import React from "react";
import AttemptV1 from "./v1/AttemptV1";

export default function Attempt({ assignmentId }: { assignmentId: string }) {
  return <AttemptV1 assignmentId={assignmentId} />;
}
