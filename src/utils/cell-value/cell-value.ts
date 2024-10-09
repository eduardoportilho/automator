import { CellValue, RowValue } from "../../types";
import { parseAmountBR } from "../currency/currency";

/**
 * Read a number from a cell
 * - If cell is string, parses using BR format
 * - If cell is number, returns
 * - return null otherwise
 */
export const parseCellNumber = (value: CellValue) => {
  if (typeof value === "string") {
    return parseAmountBR(value);
  }
  if (typeof value === "number") {
    return value;
  }
  return null;
};

/**
 * Check if a row includes the provided values
 * @param row
 * @param requiredValues values that should be present in the searched row
 * @returns
 */
export const rowIncludes = (row: RowValue, requiredValues: string[]) =>
  requiredValues.every((requiredValue) =>
    Boolean(
      row.find((cellValue) => cellValueEqualsTo(cellValue, requiredValue))
    )
  );

/**
 * Check if a row has only empty string values (or no value)
 * @param row
 * @returns
 */
export const isEmptyCellRow = (row: RowValue) =>
  row.length === 0 || row.every((cell) => isEmptyCellValue(cell));

/**
 * Check if a cell value is an empty string (after trim)
 * @param cellValue
 * @returns
 */
export const isEmptyCellValue = (cellValue: CellValue) => {
  if (cellValue == null) {
    return true;
  }
  return typeof cellValue === "string" && cellValue.trim().length === 0;
};
export const cellValueEqualsTo = (cellValue: CellValue, value: any) => {
  if (typeof cellValue === "string" && typeof value === "string") {
    return cellValue.toLowerCase().trim() === value.toLowerCase().trim();
  }
  return cellValue === value;
};
