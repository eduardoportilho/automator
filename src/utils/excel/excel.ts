import XLSX from "xlsx";
import { parseAmountBR } from "../currency/currency";

export type ExcelCellValue = string | number;

export type ExcelRowValue = ExcelCellValue[];

export type ExcelContent = ExcelRowValue[];

export function readContentFromXls(path: string): ExcelContent {
  const workbook = XLSX.readFile(path, { cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json(worksheet);
  return Object.values(json).map((obj) => Object.values(obj));
}

/**
 * Read a number from a cell
 * - If cell is string, parses using BR format
 * - If cell is number, returns
 * - return null otherwise
 */
export const parseExcelNumber = (value: ExcelCellValue) => {
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
export const rowIncludes = (row: ExcelRowValue, requiredValues: string[]) =>
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
export const isEmptyCellRow = (row: ExcelRowValue) =>
  row.length === 0 || row.every((cell) => isEmptyCellValue(cell));

/**
 * Check if a cell value is an empty string (after trim)
 * @param cellValue
 * @returns
 */
const isEmptyCellValue = (cellValue: ExcelCellValue) =>
  typeof cellValue === "string" && cellValue.trim().length === 0;

const cellValueEqualsTo = (cellValue: ExcelCellValue, value: any) => {
  if (typeof cellValue === "string" && typeof value === "string") {
    return cellValue.toLowerCase().trim() === value.toLowerCase().trim();
  }
  return cellValue === value;
};

/**
 * Find a row using a predicate function
 * @param
 * - predicate: function that test is a row is the one we are looking for
 * @returns
 */
export const findRowBy = ({
  predicate,
  excelContent,
  startingAt = 0,
}: {
  predicate: (cellRow: ExcelRowValue) => boolean;
  excelContent: ExcelContent;
  startingAt?: number;
}) => {
  const index = excelContent.findIndex((row, index) => {
    if (index < startingAt) {
      return false;
    }

    return predicate(row);
  });

  return {
    index,
    row: index >= 0 ? excelContent[index] : null,
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
  excelContent,
  startingAt = 0,
}: {
  value: any;
  column: number;
  excelContent: ExcelContent;
  startingAt?: number;
}) =>
  findRowBy({
    predicate: (row) =>
      row.length > column && cellValueEqualsTo(row[column], value),
    excelContent,
    startingAt,
  });

export const findFirstNonEmptyRow = ({
  startingAt = 0,
  column = 0,
  excelContent,
}: {
  startingAt?: number;
  column?: number;
  excelContent: ExcelContent;
}) =>
  findRowBy({
    predicate: (row) => row.length > column && !isEmptyCellValue(row[column]),
    excelContent,
    startingAt,
  });

export const findFirstEmptyRow = ({
  startingAt = 0,
  column = 0,
  excelContent,
}: {
  startingAt?: number;
  column?: number;
  excelContent: ExcelContent;
}) =>
  findRowBy({
    predicate: (row) => row.length <= column || isEmptyCellValue(row[column]),
    excelContent,
    startingAt,
  });
