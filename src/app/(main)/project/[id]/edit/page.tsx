export default function ProjectEditPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>프로젝트 편집: {params.id}</h1>
    </div>
  );
}
