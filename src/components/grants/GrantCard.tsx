import { Grant } from "@/types/grant";

interface GrantCardProps {
  grant: Grant;
  onClick?: () => void;
}

export default function GrantCard({ grant, onClick }: GrantCardProps) {
  return (
    <div className="grant-card" onClick={onClick}>
      <h3>{grant.title}</h3>
      <p>{grant.organization}</p>
      <p>마감일: {grant.deadline}</p>
    </div>
  );
}
