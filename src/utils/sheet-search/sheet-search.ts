import { CellPosition, CellValue, RowValue, SheetContent } from "../../types";
import {
  cellValueEqualsTo,
  isEmptyRow,
  isEmptyCellValue,
} from "../cell-value/cell-value";
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

export const findRowContainingValue = ({
  value,
  sheetContent,
  startingAt = 0,
}: {
  value: string;
  sheetContent: SheetContent;
  startingAt?: number;
}) =>
  findRowBy({
    predicate: (row) => row.join("|").includes(value),
    sheetContent,
    startingAt,
  });

export const findFirstNonEmptyRow = ({
  startingAt = 0,
  column,
  sheetContent,
}: {
  startingAt?: number;
  column?: number;
  sheetContent: SheetContent;
}) =>
  findRowBy({
    predicate: (row) => {
      if (column >= 0) {
        return row.length > column && !isEmptyCellValue(row[column]);
      }
      return !isEmptyRow(row);
    },
    sheetContent,
    startingAt,
  });

export const findFirstEmptyRow = ({
  startingAt = 0,
  column,
  sheetContent,
}: {
  startingAt?: number;
  column?: number;
  sheetContent: SheetContent;
}) =>
  findRowBy({
    predicate: (row) => {
      if (column >= 0) {
        return row.length <= column || isEmptyCellValue(row[column]);
      }
      return isEmptyRow(row);
    },
    sheetContent,
    startingAt,
  });

export const findCellPosition = ({
  value,
  sheetContent,
}: {
  value: CellValue;
  sheetContent: SheetContent;
}): CellPosition | null => {
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

/**
 * Find section between header and next empty row.
 * Section rows are: header, data..., empty
 * @param
 * - headerValue: value that is present on header row
 * - rows
 */
// TODO: add unit test
export const findSectionByHeader = ({
  rows,
  headerValue,
}: {
  rows: SheetContent;
  headerValue: string;
}) => {
  const { index: headerIndex } = findRowContainingValue({
    value: headerValue,
    sheetContent: rows,
  });
  const { index: nextEmptyRowIndex } = findFirstEmptyRow({
    startingAt: headerIndex,
    sheetContent: rows,
  });
  const endIndex = nextEmptyRowIndex >= 0 ? nextEmptyRowIndex : undefined;

  return rows.slice(headerIndex + 1, endIndex);
};
