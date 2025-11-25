interface FilterBarProps {
  onFilterChange?: (filters: Record<string, string>) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <select onChange={(e) => onFilterChange?.({ category: e.target.value })}>
        <option value="">전체 카테고리</option>
        <option value="startup">창업</option>
        <option value="tech">기술개발</option>
        <option value="export">수출</option>
      </select>
    </div>
  );
}
