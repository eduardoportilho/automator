import { CellValue, RowValue, SheetContent } from "../../types";
import { cellValueEqualsTo, isEmptyCellValue } from "../cell-value/cell-value";
import { rowColToA1 } from "../sheets/cellref";

/**
 * Find a row using a predicate function
 * @param
 * - predicate: function that test is a row is the one we are looking for
 * @returns
 */
export const findRowBy = ({
  predicate,
  sheetContent,
  startingAt = 0,
}: {
  predicate: (cellRow: RowValue) => boolean;
  sheetContent: SheetContent;
  startingAt?: number;
}) => {
  const index = sheetContent.findIndex((row, index) => {
    if (index < startingAt) {
      return false;
    }

    return predicate(row);
  });

  return {
    index,
    row: index >= 0 ? sheetContent[index] : null,
  };
};

/**
 * Find a row with the provided value in the provided column
 * @param
 * - value: search value
 * - column: index of the column where this value should be present
 * @returns
 */
export const findRowByColumnValue = ({
  value,
  column,
  sheetContent,
  startingAt = 0,
}: {
  value: any;
  column: number;
  sheetContent: SheetContent;
  startingAt?: number;
}) =>
  findRowBy({
    predicate: (row) =>
      row.length > column && cellValueEqualsTo(row[column], value),
    sheetContent,
    startingAt,
  });

export const findFirstNonEmptyRow = ({
  startingAt = 0,
  column = 0,
  sheetContent,
}: {
  startingAt?: number;
  column?: number;
  sheetContent: SheetContent;
}) =>
  findRowBy({
    predicate: (row) => row.length > column && !isEmptyCellValue(row[column]),
    sheetContent,
    startingAt,
  });

export const findFirstEmptyRow = ({
  startingAt = 0,
  column = 0,
  sheetContent,
}: {
  startingAt?: number;
  column?: number;
  sheetContent: SheetContent;
}) =>
  findRowBy({
    predicate: (row) => row.length <= column || isEmptyCellValue(row[column]),
    sheetContent,
    startingAt,
  });

export const findCellPosition = ({
  value,
  sheetContent,
}: {
  value: CellValue;
  sheetContent: SheetContent;
}) => {
  for (let rowIndex = 0; rowIndex < sheetContent.length; rowIndex++) {
    const row = sheetContent[rowIndex];
    const colIndex = row.findIndex((cellValue) =>
      cellValueEqualsTo(cellValue, value)
    );

    if (colIndex >= 0) {
      return {
        indexes: { row: rowIndex, col: colIndex },
        rowCol: { row: rowIndex + 1, col: colIndex + 1 },
        a1: rowColToA1({ row: rowIndex + 1, col: colIndex + 1 }),
      };
    }
  }
  return null;
};