import { Node } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/react";

export const CustomTableHeader = Node.create({
  name: "customTableHeader",
  content: "paragraph+",
  tableRole: "header_cell",
  isolating: true,

  parseHTML() {
    return [{ tag: "th" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["th", HTMLAttributes, 0];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      return (
        <NodeViewWrapper
          as="th"
          className="border border-gray-300 bg-gray-100 p-3 font-semibold text-left min-w-24 align-top"
        >
          {/* Content will be rendered by child nodes */}
        </NodeViewWrapper>
      );
    };
  },
});
