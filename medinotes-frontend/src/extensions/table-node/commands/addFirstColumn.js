import { getTableNode } from "./utils";

export const addFirstColumn = () => ({ commands, state }) => {
  const { selection } = state;
  const { $from } = selection;

  let table = getTableNode({ commands, state });
  let tableNode = table.node;
  let tableDepth = table.depth;

  if (!tableNode) return false;

  const tableStart = $from.start(tableDepth);
  const firstCellPos = tableStart + 1;

  return commands.setTextSelection(firstCellPos + 1) && commands.addColumnBefore();
};
