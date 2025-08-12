import CustomTable from "./nodes/CustomTable";
import CustomTableRow from "./nodes/CustomTableRow";
import CustomTableCell from "./nodes/CustomTableCell";
import * as commands from "./commands";
import { CustomTableNodeView } from "./nodeViews";

export default [
  CustomTable.extend({
    addNodeView() {
      return CustomTableNodeView();
    },
  }),
  CustomTableRow,
  CustomTableCell,
];
