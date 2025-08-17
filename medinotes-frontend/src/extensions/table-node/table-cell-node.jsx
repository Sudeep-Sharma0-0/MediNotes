import { Node } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/react";

export const CustomTableCell = Node.create({
  name: "customTableCell",
  content: "block+",
  tableRole: "cell",
  isolating: true,

  parseHTML() {
    return [{ tag: "td" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["td", HTMLAttributes, 0];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      return (
        <NodeViewWrapper
          as="td"
          className="border border-gray-300 p-3 min-w-24 align-top"
        >
          {/* Content will be rendered by child nodes */}
        </NodeViewWrapper>
      );
    };
  },
});
