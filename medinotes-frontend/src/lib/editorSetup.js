import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import PasteMarkdown from "./tiptap-extensions/PasteMarkdown";

export function createEditorInstance(element) {
  const editor = new Editor({
    element,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "One word at a time...",
      }),
      PasteMarkdown
    ],
    content: "",
  });

  return editor;
}
