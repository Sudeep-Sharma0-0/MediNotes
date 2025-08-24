import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { TableComponent } from "./components/TableComponent";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { addFinalRow } from "./commands/addFinalRow";
import { addFirstColumn } from "./commands/addFirstColumn";
import { addFinalColumn } from "./commands/addFinalColumn";

export const CustomTable = Table.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TableComponent);
  },
  addCommands() {
    return {
      ...this.parent?.(),
      addFinalRow,
      addFirstColumn,
      addFinalColumn,
    }
  }
});

export const CustomTableRow = TableRow.extend({
});

export const CustomTableCell = TableCell.extend({
});

export const CustomTableHeader = TableHeader.extend({
});
