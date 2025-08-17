import { Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

export const CustomTable = Node.create({
  name: "customTable",
  group: "block",
  content: "customTableRow+",
  tableRole: "table",
  isolating: true,

  parseHTML() {
    return [{ tag: "table" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "table",
      { ...HTMLAttributes, class: "border-collapse w-full border border-gray-300" },
      0
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      return (
        <NodeViewWrapper as="table">
        </NodeViewWrapper>
      );
    };
  },
});
