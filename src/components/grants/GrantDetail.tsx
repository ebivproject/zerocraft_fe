import { Grant } from "@/types/grant";

interface GrantDetailProps {
  grant: Grant;
}

export default function GrantDetail({ grant }: GrantDetailProps) {
  return (
    <div className="grant-detail">
      <h1>{grant.title}</h1>
      <p>{grant.description}</p>
      <div className="grant-info">
        <p>기관: {grant.organization}</p>
        <p>마감일: {grant.deadline}</p>
        <p>지원금액: {grant.amount}</p>
      </div>
    </div>
  );
}
