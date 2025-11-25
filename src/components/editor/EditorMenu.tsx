interface EditorMenuProps {
  onSave?: () => void;
  onExport?: () => void;
}

export default function EditorMenu({ onSave, onExport }: EditorMenuProps) {
  return (
    <div className="editor-menu">
      <button onClick={onSave}>저장</button>
      <button onClick={onExport}>내보내기</button>
    </div>
  );
}
