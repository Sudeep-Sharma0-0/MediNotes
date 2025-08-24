import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
import { marked } from "marked";
import { TextSelection } from "prosemirror-state";
import { returnMarkdown } from "./PasteMarkdown";

marked.use({
  gfm: true,
  breaks: true,
});
/**
 * Paste a Markdown table into a Tiptap editor using CustomTable extensions
 * @param {import("prosemirror-view").EditorView} view
 * @param {string} text - Markdown table string
 */
export function pasteTable(view, text) {
  const { schema } = view.state;
  const Table = schema.nodes.table;
  const TableRow = schema.nodes.tableRow;
  const TableCell = schema.nodes.tableCell;
  const TableHeader = schema.nodes.tableHeader;
  const parser = ProseMirrorDOMParser.fromSchema(schema);

  const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (rawLines.length < 2) return;

  const parseAlignmentRow = line => {
    const cells = line.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
    return cells.map(c => {
      if (!/-/.test(c)) return "left";
      const startsColon = c.startsWith(":");
      const endsColon = c.endsWith(":");
      if (startsColon && endsColon) return "center";
      if (endsColon) return "right";
      return "left";
    });
  };

  const parseCellContent = cellText => {
    return returnMarkdown(parser, cellText);
  };

  const splitCells = line => {
    const trimmed = line.trim().replace(/^\||\|$/g, "");
    return trimmed.split("|").map(c => parseCellContent(c.trim()));
  };

  const potentialAlignRow = rawLines[1];
  let alignments = [];
  let dataStartIndex = 1;

  if (/^[:\-\s|]+$/.test(potentialAlignRow) && /-/.test(potentialAlignRow)) {
    alignments = parseAlignmentRow(potentialAlignRow);
    dataStartIndex = 2;
  } else {
    const firstRowCells = rawLines[0].replace(/^\||\|$/g, "").split("|");
    alignments = firstRowCells.map(() => "left");
  }

  const headerCells = splitCells(rawLines[0]).map((fragment, i) =>
    TableHeader.create({ class: `text-${alignments[i]}` }, fragment)
  );
  const headerRow = TableRow.create({}, headerCells);

  const bodyRows = rawLines.slice(dataStartIndex).map(line => {
    const cells = splitCells(line).map((fragment, i) =>
      TableCell.create({ class: `text-${alignments[i]}` }, fragment)
    );
    return TableRow.create({}, cells);
  });

  const tableNode = Table.create({}, [headerRow, ...bodyRows]);

  let { tr } = view.state;
  tr = tr.replaceSelectionWith(tableNode);

  const after = tr.selection.from + tableNode.nodeSize;
  const resolved = tr.doc.resolve(Math.min(after, tr.doc.content.size));
  tr = tr.setSelection(TextSelection.near(resolved));

  view.dispatch(tr.scrollIntoView());
}
