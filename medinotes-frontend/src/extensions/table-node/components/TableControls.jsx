import React, { useState } from 'react';

export const TableControls = ({ node, getPos, editor }) => {
  const [hoveredCol, setHoveredCol] = useState(-1);
  const [hoveredRow, setHoveredRow] = useState(-1);

  const addRow = (index) => {
    const pos = getPos();
    if (pos === undefined) return;
    const { tr } = editor.state;
    const { customTableRow, customTableCell, paragraph } = editor.schema.nodes;

    const colCount = node.firstChild?.childCount || 1;
    const cells = Array.from({ length: colCount }, () =>
      customTableCell.create({}, paragraph.create())
    );
    const newRow = customTableRow.create({}, cells);

    let insertPos = pos + 1;
    for (let i = 0; i < index; i++) {
      insertPos += node.child(i).nodeSize;
    }

    tr.insert(insertPos, newRow);
    editor.view.dispatch(tr);
  };

  const addColumn = () => {
    const pos = getPos();
    if (pos === undefined) return;
    const { tr } = editor.state;
    const { customTableCell, customTableHeader, paragraph } = editor.schema.nodes;

    let currentPos = pos + 1;
    const headerCell = customTableHeader.create({}, paragraph.create());
    const firstRowEnd = currentPos + node.firstChild.nodeSize - 1;
    tr.insert(firstRowEnd, headerCell);
    currentPos = firstRowEnd + headerCell.nodeSize;

    for (let i = 1; i < node.childCount; i++) {
      const row = node.child(i);
      const cell = customTableCell.create({}, paragraph.create());
      const rowEnd = currentPos + row.nodeSize - 1;
      tr.insert(rowEnd, cell);
      currentPos = rowEnd + cell.nodeSize;
    }

    editor.view.dispatch(tr);
  };

  const deleteRow = (index) => {
    if (node.childCount <= 1) return;
    const pos = getPos();
    if (pos === undefined) return;
    const { tr } = editor.state;
    const row = node.child(index);
    let rowPos = pos + 1;

    for (let i = 0; i < index; i++) {
      rowPos += node.child(i).nodeSize;
    }

    tr.delete(rowPos, rowPos + row.nodeSize);
    editor.view.dispatch(tr);
  };

  const deleteColumn = (colIndex) => {
    const colCount = node.firstChild?.childCount || 1;
    if (colCount <= 1) return;
    const pos = getPos();
    if (pos === undefined) return;
    const { tr } = editor.state;

    for (let rowIndex = node.childCount - 1; rowIndex >= 0; rowIndex--) {
      const row = node.child(rowIndex);
      let cellPos = pos + 1;

      for (let i = 0; i < rowIndex; i++) {
        cellPos += node.child(i).nodeSize;
      }

      cellPos += 1;
      for (let i = 0; i < colIndex; i++) {
        cellPos += row.child(i).nodeSize;
      }

      const cell = row.child(colIndex);
      tr.delete(cellPos, cellPos + cell.nodeSize);
    }

    editor.view.dispatch(tr);
  };

  const colCount = node.firstChild?.childCount || 0;
  const rowCount = node.childCount;

  return {
    addRow,
    addColumn,
    deleteRow,
    deleteColumn,
    colCount,
    rowCount,
    hoveredCol,
    hoveredRow,
    setHoveredCol,
    setHoveredRow
  };
};
