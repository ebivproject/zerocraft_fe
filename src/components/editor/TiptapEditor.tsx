"use client";

interface TiptapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  return (
    <div className="tiptap-editor">
      {/* Tiptap 에디터 구현 예정 */}
      <div className="editor-content" contentEditable>
        {content}
      </div>
    </div>
  );
}
