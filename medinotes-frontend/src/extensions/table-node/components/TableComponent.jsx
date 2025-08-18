import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

export const TableComponent = ({ node }) => {
  return (
    <NodeViewWrapper as="table" className="custom-table">
      <NodeViewContent as="tbody" />
    </NodeViewWrapper>
  );
};
