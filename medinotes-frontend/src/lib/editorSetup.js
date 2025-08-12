import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import PasteMarkdown from "./tiptap-extensions/PasteMarkdown";
import FileNameHeader from "./tiptap-extensions/FileNameHeader";
import PreventDefaultKeys from "./tiptap-extensions/PreventDefaultKeys";
import EmptyClassPlugin from "./tiptap-extensions/EmptyClassPlugin";
import PasteTable from "./tiptap-extensions/PasteTable";
import CustomTableExtensions from "./tiptap-extensions/custom-table/index.js";
import { TableKeymap } from "./tiptap-extensions/custom-table/table-extensions/TableKeybinds";
import { FormattingKeybinds } from "./tiptap-extensions/FormattingKeybinds";

export function createEditorInstance(element) {
  const editor = new Editor({
    element,
    extensions: [
      FileNameHeader,
      PreventDefaultKeys,
      EmptyClassPlugin,
      PasteTable,
      TableKeymap,
      FormattingKeybinds,
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
