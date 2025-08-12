import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { DOMParser as ProseMirrorDOMParser } from "@tiptap/pm/model";
import { marked } from "marked";
import { insertCustomTableFromMatrix } from "./custom-table/commands";

marked.setOptions({
  gfm: true,
  breaks: true,
});

export const PasteTable = Extension.create({
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

              const parsedMatrix = matrix.map(row =>
                row.map(cellText => parseCellTextToNodes(schema, cellText))
              );

              const tableNode = insertCustomTableFromMatrix(schema, parsedMatrix);
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
  const lines = text.trim().split("\n");
  if (lines.length < 2) return false;

  const header = lines[0];
  const separator = lines[1];

  const hasPipes = header.includes("|") && separator.includes("|");
  const isSeparator = /^\s*\|?\s*[:\-]+(\s*\|\s*[:\-]+)*\s*\|?\s*$/.test(separator);

  return hasPipes && isSeparator;
}

function markdownToMatrix(md) {
  const lines = md.trim().split("\n");

  if (
    lines.length > 1 &&
    /^\s*\|?\s*[:\-]+(\s*\|\s*[:\-]+)*\s*\|?\s*$/.test(lines[1])
  ) {
    lines.splice(1, 1);
  }

  return lines.map(line =>
    line
      .trim()
      .replace(/^\s*\|/, "")
      .replace(/\|\s*$/, "")
      .split("|")
      .map(cell => cell.trim())
  );
}

function parseCellTextToNodes(schema, markdownText) {
  const html = marked.parse(markdownText);
  const container = document.createElement("div");
  container.innerHTML = html;
  const node = ProseMirrorDOMParser.fromSchema(schema).parse(container);
  return node;
}

export default PasteTable;
