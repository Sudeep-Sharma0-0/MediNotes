export function insertCustomTable(schema, rows = 2, cols = 2, cellText = "") {
  const rowNodes = [];

  for (let r = 0; r < rows; r++) {
    const cellNodes = [];
    for (let c = 0; c < cols; c++) {
      const paragraph = schema.nodes.paragraph.createAndFill({}, schema.text(cellText));
      if (!paragraph) throw new Error("Failed to create paragraph node");

      const cell = schema.nodes.customTableCell.createAndFill(
        { isHeader: r === 0 },
        paragraph
      );
      if (!cell) throw new Error("Failed to create customTableCell node");

      cellNodes.push(cell);
    }
    rowNodes.push(schema.nodes.customTableRow.createAndFill({}, cellNodes));
  }

  return schema.nodes.customTable.createAndFill({}, rowNodes);
}

export function insertCustomTableFromMatrix(schema, matrix) {
  const rowNodes = matrix.map((row, rowIndex) => {
    const cellNodes = row.map(cellContent => {
      let contentNode;

      if (cellContent.type.name === "doc") {
        contentNode = cellContent.content; // Fragment of blocks
      } else if (cellContent.type.isBlock) {
        contentNode = cellContent;
      } else {
        contentNode = schema.nodes.paragraph.createChecked({}, cellContent);
      }

      if (!contentNode) throw new Error("Failed to create content node");

      const cellNode =
        contentNode.constructor.name === "Fragment"
          ? schema.nodes.customTableCell.createChecked(
              { isHeader: rowIndex === 0 },
              contentNode
            )
          : schema.nodes.customTableCell.createAndFill(
              { isHeader: rowIndex === 0 },
              contentNode
            );

      if (!cellNode) throw new Error("Failed to create customTableCell node");

      return cellNode;
    });

    const rowNode = schema.nodes.customTableRow.createAndFill({}, cellNodes);

    if (!rowNode) throw new Error("Failed to create customTableRow node");

    return rowNode;
  });

  const tableNode = schema.nodes.customTable.createAndFill({}, rowNodes);

  if (!tableNode) throw new Error("Failed to create customTable node");

  return tableNode;
}
