import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
import { marked } from "marked";
import { NodeSelection } from "prosemirror-state";

/**
 * Handles pasting a Markdown table as ProseMirror table nodes.
 * Each cell content is parsed as Markdown.
 * @param {import("prosemirror-view").EditorView} view
 * @param {string} text - Markdown table text
 */
export function pasteTable(view, text) {
  const { customTable, customTableRow, customTableCell, customTableHeader } = view.state.schema.nodes;
  const parser = ProseMirrorDOMParser.fromSchema(view.state.schema);

  const lines = text.split("\n")
    .map(line => line.trim())
    .filter(line => line && !/^[\|\-\s:]+$/.test(line));

  if (lines.length < 2) return;

  const parseCellContent = (cellText) => {
    const html = marked(cellText); // convert Markdown to HTML
    const container = document.createElement("div");
    container.innerHTML = html;
    const doc = parser.parse(container, { preserveWhitespace: true });
    return doc.content;
  };

  const splitCells = (line) => line.split("|").map(cell => parseCellContent(cell.trim()));

  // Header row
  const headerCells = splitCells(lines[0]).map(fragment => customTableHeader.create({}, fragment));
  const headerRow = customTableRow.create({}, headerCells);

  // Body rows
  const bodyRows = lines.slice(1).map(line => {
    const cells = splitCells(line).map(fragment => customTableCell.create({}, fragment));
    return customTableRow.create({}, cells);
  });

  const tableNode = customTable.create({}, [headerRow, ...bodyRows]);

  let { tr, selection } = view.state;

  // Insert table at selection
  tr = tr.replaceSelectionWith(tableNode);

  // Move cursor immediately after the table
  const afterTablePos = tr.selection.from + tableNode.nodeSize;
  const resolvedPos = tr.doc.resolve(Math.min(afterTablePos, tr.doc.content.size));
  tr = tr.setSelection(selection.constructor.near(resolvedPos));

  view.dispatch(tr.scrollIntoView());
}
