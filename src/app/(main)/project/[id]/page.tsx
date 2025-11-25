export default function ProjectViewPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>프로젝트 뷰어: {params.id}</h1>
    </div>
  );
}
