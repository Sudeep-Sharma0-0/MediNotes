import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { TableComponent } from "./components/TableComponent";
import { ReactNodeViewRenderer } from "@tiptap/react";

export const CustomTable = Table.extend({
  addOptions() {
    return {
      ...Table.options,
      resizable: true,
      lastColumnResizable: false,
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(TableComponent);
  },
});

export const CustomTableRow = TableRow.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: element => element.getAttribute("class"),
        renderHTML: attributes => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
    };
  },
});

export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: element => element.getAttribute("class"),
        renderHTML: attributes => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
    };
  },
});

export const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: element => element.getAttribute("class"),
        renderHTML: attributes => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
    };
  },
});
