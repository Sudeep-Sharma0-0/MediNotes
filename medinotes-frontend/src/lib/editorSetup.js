import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import PasteMarkdown from "./tiptap-extensions/PasteMarkdown";
import FileNameHeader from "./tiptap-extensions/FileNameHeader";
import PreventDefaultKeys from "./tiptap-extensions/PreventDefaultKeys";
import EmptyClassPlugin from "./tiptap-extensions/EmptyClassPlugin";
import PasteTable from "./tiptap-extensions/PasteTable";
import CustomTableExtensions from "./tiptap-extensions/custom-table/index.js";

export function createEditorInstance(element) {
  const editor = new Editor({
    element,
    extensions: [
      FileNameHeader,
      PreventDefaultKeys,
      EmptyClassPlugin,
      PasteTable,
      //PasteMarkdown,
      StarterKit,
      ...CustomTableExtensions,
    ],
    content: {
      type: "doc",
      content: [{ type: "filename" }, { type: "paragraph" }],
    },
  });

  return editor;
}
