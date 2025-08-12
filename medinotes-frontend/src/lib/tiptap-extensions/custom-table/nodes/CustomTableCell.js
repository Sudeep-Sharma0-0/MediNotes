import { Node, mergeAttributes } from "@tiptap/core";

const CustomTableCell = Node.create({
  name: "customTableCell",

  content: "block+",
  isolating: true,
  selectable: false,
  draggable: false,

  addAttributes() {
    return {
      colspan: { default: 1 },
      rowspan: { default: 1 },
      isHeader: { default: false },
      class: { default: "custom-table-cell" },
    };
  },

  parseHTML() {
    return [
      { tag: "td" },
      { tag: "th", getAttrs: () => ({ isHeader: true }) }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const tag = HTMLAttributes.isHeader ? "th" : "td";
    return [
      tag,
      mergeAttributes(HTMLAttributes),
      ["div", 0]
    ];
  },
});

export default CustomTableCell;
