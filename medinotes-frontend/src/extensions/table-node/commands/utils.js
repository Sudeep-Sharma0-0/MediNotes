export const getTableNode = ({ commands, state }) => {
  const { selection } = state;
  const { $from } = selection;

  let tableDepth = null;
  let tableNode = null;

  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth);
    if (node.type.name === 'table') {
      tableDepth = depth;
      tableNode = node;
      break;
    }
  }
  return { node: tableNode, depth: tableDepth };
}
