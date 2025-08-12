import { Node, mergeAttributes } from "@tiptap/core";

const CustomTable = Node.create({
  name: "customTable",

  group: "block",
  content: "customTableRow+",
  isolating: true,
  selectable: false,
  draggable: false,

  addAttributes() {
    return {
      class: {
        default: "custom-table",
      },
    };
  },

  parseHTML() {
    return [{ tag: "table.custom-table" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["table", mergeAttributes(HTMLAttributes), 0];
  },
});

export default CustomTable;