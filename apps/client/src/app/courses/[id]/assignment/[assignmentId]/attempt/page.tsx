import AttemptAssignment from "@/component/courses/AttempAssignment/AttemptAssignment";

export default async function AttemptPage({
  params,
}: {
  params: { assignmentId: string; id: string };
}) {
  const { assignmentId, id } = await params;
  console.log("assignmentId", assignmentId);
  return <AttemptAssignment assignmentId={assignmentId} />;
}
