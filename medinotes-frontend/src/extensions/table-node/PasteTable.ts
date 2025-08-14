import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

/**
 * Detect if text is a Markdown table
 */
function isMarkdownTable(text: string) {
  if (!text) return false;
  // Must have at least 2 rows and one separator row
  const lines = text.trim().split("\n");
  if (lines.length < 2) return false;

  // The second line must be the separator
  const separatorPattern = /^\s*\|?\s*(:?-+:?\s*\|)+\s*(:?-+:?\s*)\|?\s*$/;
  const isSeparator = separatorPattern.test(lines[1]);
  return isSeparator;
}

/**
 * Parse Markdown table into rows
 */
function parseMarkdownTable(text: string): string[][] {
  const lines = text
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  console.log("[PasteTable] Raw lines:", lines);

  // Find separator line index
  const separatorIndex = lines.findIndex((line) =>
    /^\s*\|?\s*(:?-+:?\s*\|)+\s*(:?-+:?\s*)\|?\s*$/.test(line)
  );
  if (separatorIndex === -1) return [];

  console.log("[PasteTable] Separator found at line:", separatorIndex);

  const rows: string[][] = [];

  lines.forEach((line, i) => {
    if (i === separatorIndex) return; // skip separator line
    if (!line.includes("|")) return; // must contain a pipe

    const cells = line
      .replace(/^\||\|$/g, "") // trim leading/trailing pipes
      .split("|")
      .map((c) => c.trim());

    if (cells.every((c) => c === "")) return; // skip empty rows
    rows.push(cells);
  });

  console.log("[PasteTable] Parsed rows:", rows);
  return rows;
}

export const PasteTable = Extension.create({
  name: "markdownTablePaste",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("markdownTablePaste"),
        props: {
          handlePaste(view, event) {
            const clipboardData = event.clipboardData;
            if (!clipboardData) return false;

            const text = clipboardData.getData("text/plain");
            if (!text) return false;

            console.log("[PasteTable] Pasted text:", text);

            if (!isMarkdownTable(text)) {
              console.log("[PasteTable] Not a markdown table.");
              return false;
            }

            console.log("[PasteTable] Detected markdown table.");

            event.preventDefault();

            const rows = parseMarkdownTable(text);
            if (!rows.length) {
              console.log("[PasteTable] No valid rows found.");
              return false;
            }

            const { state, dispatch } = view;
            const { tr, selection } = state;

            const tableNode = state.schema.nodes.customTable.create(
              {},
              rows.map((row, rowIndex) =>
                state.schema.nodes.customTableRow.create(
                  {},
                  row.map((cell) =>
                    state.schema.nodes.customTableCell.create(
                      { header: rowIndex === 0 },
                      state.schema.text(cell)
                    )
                  )
                )
              )
            );

            console.log(
              "[PasteTable] Inserting table node:",
              tableNode.toJSON()
            );

            tr.replaceSelectionWith(tableNode);
            dispatch(tr.scrollIntoView());

            return true;
          },
        },
      }),
    ];
  },
});
