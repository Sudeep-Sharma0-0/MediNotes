import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { insertCustomTableFromMatrix } from "./custom-table/commands";

const PasteTable = Extension.create({
  name: "pasteTable",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            const text = event.clipboardData.getData("text/plain");

            if (isMarkdownTable(text)) {
              event.preventDefault();

              const { schema } = view.state;
              const matrix = markdownToMatrix(text);

              const tableNode = insertCustomTableFromMatrix(schema, matrix);
              const tr = view.state.tr.replaceSelectionWith(tableNode);

              view.dispatch(tr.scrollIntoView());
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});

function isMarkdownTable(text) {
  // Detects GFM-style tables, allowing optional leading/trailing pipes
  const lines = text.trim().split("\n");
  if (lines.length < 2) return false;

  const header = lines[0];
  const separator = lines[1];

  const hasPipes = header.includes("|") && separator.includes("|");
  const isSeparator = /^\s*\|?\s*[:\-]+(\s*\|\s*[:\-]+)*\s*\|?\s*$/.test(separator);

  console.log("Markdown Table Detection:", {
    hasPipes,
    isSeparator,
    header,
    separator,
  });

  return hasPipes && isSeparator;
}

function markdownToMatrix(md) {
  const lines = md.trim().split("\n");

  if (lines.length > 1 && /^\s*\|?\s*[:\-]+(\s*\|\s*[:\-]+)*\s*\|?\s*$/.test(lines[1])) {
    lines.splice(1, 1);
  }

  console.log("Markdown to Matrix Conversion:", lines);

  return lines.map(line =>
    line
      .replace(/^\s*\|/, "")
      .replace(/\|\s*$/, "")
      .split("|")
      .map(cell => cell.trim())
  );
}

export default PasteTable;