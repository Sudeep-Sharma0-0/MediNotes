import { pasteTable } from "./PasteMarkdownTable";
import { pasteMarkdown } from "./PasteMarkdown";

/** Detect if text is a Markdown table */
export function isTable(text) {
  const tablePattern =
    /^\s*\|?(\s*[^|\n]+?\s*\|)+\s*\n\s*\|?(\s*[:-]+[-| :]*)\|?\s*\n/m;
  return tablePattern.test(text);
}

/** Detect if text is general Markdown (excluding tables) */
export function isMarkdown(text) {
  if (!text) return false;
  if (isTable(text)) return false;

  const markdownPattern = new RegExp([
    /(^|\n)#{1,6}\s/.source,      // headings
    /(^|\n)[*-]\s/.source,        // unordered lists
    /(^|\n)\d+\.\s/.source,       // ordered lists
    /\*\*.*\*\*/.source,          // bold
    /\*.*\*/.source,              // italic
    /`[^`]+`/.source,             // inline code
    /```[\s\S]*```/.source,       // code block
    />\s/.source,                 // blockquote
    /-{3,}/.source,               // horizontal rule
  ].join("|"));

  return markdownPattern.test(text);
}

/**
 * Splits Markdown into blocks: table blocks and non-table blocks
 * Handles multiple tables and mixed Markdown
 * @param {string} text
 * @returns {Array<{ type: 'table'|'markdown', content: string }>}
 */
function splitMarkdownBlocks(text) {
  const lines = text.split("\n");
  const blocks = [];
  let buffer = [];
  let inTable = false;

  const flushBuffer = (type) => {
    if (buffer.length > 0) {
      const content = buffer.join("\n").replace(/^\n+|\n+$/g, "");
      if (content) {
        blocks.push({ type, content });
      }
      buffer = [];
    }
  };

  const isTableHeader = (line) => /^\s*\|.*\|/.test(line);
  const isTableSeparator = (line) => /^\s*\|?(\s*[:-]+[-| :]*)\|?\s*$/.test(line);
  const isTableRow = (line) => /^\s*\|.*\|/.test(line);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inTable) {
      if (isTableHeader(line) && isTableSeparator(lines[i + 1] || "")) {
        flushBuffer("markdown");
        inTable = true;
        buffer.push(line);
        buffer.push(lines[i + 1]);
        i++;
        continue;
      }
      buffer.push(line);
    } else {
      if (isTableRow(line)) {
        buffer.push(line);
      } else {
        flushBuffer("table");
        inTable = false;
        buffer.push(line);
      }
    }
  }

  flushBuffer(inTable ? "table" : "markdown");
  console.log(blocks);
  return blocks;
}

/**
 * Main paste handler
 * Delegates table vs markdown and ensures spacing between blocks
 * @param {EditorView} view - Tiptap / ProseMirror editor view
 * @param {string} text - Markdown content to paste
 */
export function handlePaste(view, text) {
  if (!text) return false;

  const blocks = splitMarkdownBlocks(text);

  for (const block of blocks) {
    if (block.type === "table") {
      pasteTable(view, block.content.trim() + "\n\n");
    } else {
      pasteMarkdown(view, block.content.trim() + "\n\n");
    }
  }

  return true;
}
