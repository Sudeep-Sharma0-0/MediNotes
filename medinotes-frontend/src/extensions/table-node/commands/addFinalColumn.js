import { getTableNode } from "./utils";

export const addFinalColumn = () => ({ commands, state }) => {
  const { selection } = state;
  const { $from } = selection;

  let table = getTableNode({ commands, state });
  let tableNode = table.node;
  let tableDepth = table.depth;

  if (!tableNode) return false;

  const firstRow = tableNode.child(0);
  const lastColumnIndex = firstRow.childCount - 1;

  const tableStart = $from.start(tableDepth);
  let lastCellPos = tableStart + 1 + 1;

  for (let i = 0; i < lastColumnIndex; i++) {
    lastCellPos += firstRow.child(i).nodeSize;
  }

  const lastCellContentPos = lastCellPos + 1;

  return commands.setTextSelection(lastCellContentPos) && commands.addColumnAfter();
};
