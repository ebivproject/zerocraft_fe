interface ToolbarProps {
  onBold?: () => void;
  onItalic?: () => void;
  onUnderline?: () => void;
}

export default function Toolbar({ onBold, onItalic, onUnderline }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button onClick={onBold}>B</button>
      <button onClick={onItalic}>I</button>
      <button onClick={onUnderline}>U</button>
    </div>
  );
}
