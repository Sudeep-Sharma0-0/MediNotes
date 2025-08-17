import { Node } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/react";

export const CustomTableRow = Node.create({
  name: "customTableRow",
  content: "(customTableCell | customTableHeader)+",
  tableRole: "row",
  isolating: true,

  parseHTML() {
    return [{ tag: "tr" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["tr", HTMLAttributes, 0];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      return (
        <NodeViewWrapper as="tr">
          {/* Content will be rendered by child nodes */}
        </NodeViewWrapper>
      );
    };
  },
});
