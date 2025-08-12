export function insertCustomTable(schema, rows = 2, cols = 2, cellText = "") {
  const rowNodes = [];

  for (let r = 0; r < rows; r++) {
    const cellNodes = [];
    for (let c = 0; c < cols; c++) {
      cellNodes.push(
        schema.nodes.customTableCell.createAndFill(
          { isHeader: r === 0 },
          schema.text(cellText)
        )
      );
    }
    rowNodes.push(schema.nodes.customTableRow.createAndFill({}, cellNodes));
  }

  return schema.nodes.customTable.createAndFill({}, rowNodes);
}

export function insertCustomTableFromMatrix(schema, matrix) {
  const rowNodes = matrix.map((row, rowIndex) => {
    const cellNodes = row.map((cellText) =>
      schema.nodes.customTableCell.createAndFill(
        { isHeader: rowIndex === 0 }, // first row = header
        schema.text(cellText)
      )
    );
    return schema.nodes.customTableRow.createAndFill({}, cellNodes);
  });

  return schema.nodes.customTable.createAndFill({}, rowNodes);
}
