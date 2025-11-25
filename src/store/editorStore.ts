import { create } from "zustand";

interface EditorState {
  content: string;
  isSaving: boolean;
  lastSaved: Date | null;
  setContent: (content: string) => void;
  setSaving: (isSaving: boolean) => void;
  setLastSaved: (date: Date) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  content: "",
  isSaving: false,
  lastSaved: null,
  setContent: (content) => set({ content }),
  setSaving: (isSaving) => set({ isSaving }),
  setLastSaved: (date) => set({ lastSaved: date }),
}));
