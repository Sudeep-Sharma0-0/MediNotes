import { Node } from "@tiptap/core";

const CustomTableRow = Node.create({
  name: "customTableRow",

  content: "customTableCell+",
  tableRole: "row",
  isolating: true,
  selectable: false,
  draggable: false,

  parseHTML() {
    return [{ tag: "tr" }];
  },

  renderHTML() {
    return ["tr", 0];
  },
});

export default CustomTableRow;