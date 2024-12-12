const A1 = /^([A-Z]+)(\d+)$/;

interface RowCol {
  row: number; // 1 based
  col: number; // 1 based
}

const addRowCol = (rowCol: RowCol, { rows = 0, cols = 0 }): RowCol => {
  return {
    row: rowCol.row + rows,
    col: rowCol.col + cols,
  };
};

export const a1ToRowCol = (ref: string): RowCol => {
  if (!A1.test(ref)) {
    throw new Error(`${ref} is not a valid A1 cell reference`);
  }
  const [columnStr, rowStr] = ref.replace(A1, "$1,$2").split(",");
  let column = 0;

  for (let i = 0; i < columnStr.length; i++) {
    column = 26 * column + columnStr.charCodeAt(i) - 64;
  }
  return {
    row: parseInt(rowStr, 10),
    col: column,
  };
};

export const rowColToA1 = (
  rowCol: RowCol,
  sheetTitle: string | undefined = undefined
): string => {
  if (rowCol.row < 1 || rowCol.col < 1) {
    throw new Error(`${rowCol} is not a valid [row,col] cell reference`);
  }
  let column = rowCol.col;
  let columnStr = "";

  for (; column; column = Math.floor((column - 1) / 26)) {
    columnStr = String.fromCharCode(((column - 1) % 26) + 65) + columnStr;
  }
  const sheetPrefix = sheetTitle ? `${sheetTitle}!` : "";

  return `${sheetPrefix}${columnStr}${rowCol.row}`;
};

export const rangeA1 = (
  sheet: string,
  startA1: string,
  rows: number,
  cols: number
): string => {
  const startRC = a1ToRowCol(startA1);
  const endRC = addRowCol(startRC, { rows, cols });
  const endA1 = rowColToA1(endRC);
  return rangeA1String(sheet, startA1, endA1);
};

export const rangeA1String = (
  sheet: string,
  startA1: string,
  endA1: string
): string => {
  const sheetPrefix = sheet ? `${sheet}!` : "";
  return `${sheetPrefix}${startA1}:${endA1}`;
};
