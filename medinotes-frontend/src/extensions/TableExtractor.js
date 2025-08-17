export default function extractTables(text) {
  const blocks = [];
  const lines = text.split("\n");
  let buffer = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableHeader = /^\|.*\|/.test(line);
    const isTableDivider = /^\|[\s:-|]+$/.test(line);

    if (isTableHeader && lines[i + 1] && /^\|[\s:-|]+$/.test(lines[i + 1])) {
      if (buffer.length) {
        blocks.push({ type: "text", content: buffer.join("\n") });
        buffer = [];
      }
      inTable = true;
      buffer.push(line);
      continue;
    }

    if (inTable) {
      if (/^\|.*\|/.test(line)) {
        buffer.push(line);
        continue;
      } else {
        blocks.push({ type: "table", content: buffer.join("\n") });
        buffer = [line];
        inTable = false;
        continue;
      }
    }

    buffer.push(line);
  }

  if (buffer.length) {
    blocks.push({ type: inTable ? "table" : "text", content: buffer.join("\n") });
  }

  return blocks;
}

