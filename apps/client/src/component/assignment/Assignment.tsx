import AssignmentV2 from "./v2/AssignmentV2";

export default function Assignment({
  assignments = [],
}: {
  assignments?: any[];
}) {
  return <AssignmentV2 assignments={assignments} />;
}
