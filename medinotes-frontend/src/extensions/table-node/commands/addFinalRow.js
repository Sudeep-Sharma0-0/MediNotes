import { getTableNode } from "./utils";

export const addFinalRow = () => ({ commands, state }) => {
  const { selection } = state;
  const { $from } = selection;

  let table = getTableNode({ commands, state });
  let tableNode = table.node;
  let tableDepth = table.depth;

  if (!tableNode) return false;

  const lastRowIndex = tableNode.childCount - 1;
  const lastRow = tableNode.child(lastRowIndex);

  const tableStart = $from.start(tableDepth);
  let lastCellPos = tableStart + 1;

  for (let i = 0; i < lastRowIndex; i++) {
    lastCellPos += tableNode.child(i).nodeSize;
  }

  for (let i = 0; i < lastRow.childCount - 1; i++) {
    lastCellPos += lastRow.child(i).nodeSize;
  }

  return commands.setTextSelection(lastCellPos + 1) && commands.addRowAfter();
};
