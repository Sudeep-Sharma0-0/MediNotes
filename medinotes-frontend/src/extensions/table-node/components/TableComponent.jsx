import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { TableExpandButton } from "./TableExpandButton";

export const TableComponent = ({ node }) => {
  let colWidths = [];

  // Get the first row
  const firstRow = node?.content?.firstChild;

  if (firstRow && firstRow.content && firstRow.content.size > 0) {
    // Convert the Fragment to an array
    colWidths = [];
    firstRow.content.forEach(cell => {
      // cell.attrs.colwidth is an array or undefined
      colWidths.push(cell.attrs?.colwidth?.[0] || 100);
    });
  }

  return (
    <NodeViewWrapper as="div" className="table-container">
      <TableExpandButton type="right" />
      <TableExpandButton type="left" />
      <TableExpandButton type="bottom" />
      <table className="custom-table">
        <NodeViewContent as="tbody" />
      </table>
    </NodeViewWrapper>
  );
};
