export default function GrantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>지원사업 상세: {params.id}</h1>
    </div>
  );
}
