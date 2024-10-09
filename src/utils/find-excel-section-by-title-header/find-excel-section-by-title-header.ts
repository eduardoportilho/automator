import { RowValue, SheetContent } from "../../types";
import { isEmptyCellRow, rowIncludes } from "../cell-value/cell-value";
import { findRowBy, findRowByColumnValue } from "../sheet-search/sheet-search";

/**
 * Check if row is a section title:
 * - 1 or 2 columns
 * - first value is a non-empty string
 * @param row
 * @returns
 */
const isTitleRow = (row: RowValue) => {
  if (row.length < 1 || row.length > 2) {
    return false;
  }

  if (typeof row[0] !== "string") {
    return false;
  }

  return row[0].trim().length > 0;
};

/**
 * Find a section with multiple content blocks:
 * - Find the row with the provided title (at col 0)
 * - Find next title row - section is between those rows
 * - Remove empty and header rows (based on provided headerCells)
 * @param
 * - title: section title
 * - headerCells: values that should be present in header rows
 * @returns
 * - titleIndex: title row index
 * - endIndex: index of the next title row after section
 * - section: rows between thos indexes
 */
export const findExcelSectionByTitleAndHeader = ({
  title,
  excelContent,
  headerCells,
  startingAt = 0,
}: {
  title: string;
  excelContent: SheetContent;
  startingAt?: number;
  headerCells: string[];
}): {
  titleIndex: number;
  endIndex: number;
  section: SheetContent;
} => {
  const { index: titleIndex } = findRowByColumnValue({
    value: title,
    column: 0,
    sheetContent: excelContent,
    startingAt,
  });

  if (titleIndex < 0) {
    return {
      titleIndex: -1,
      endIndex: -1,
      section: [],
    };
  }
  const { index: nextTitleRowIndex } = findRowBy({
    startingAt: titleIndex + 1,
    sheetContent: excelContent,
    predicate: (row) => isTitleRow(row),
  });

  const endIndex = nextTitleRowIndex >= 0 ? nextTitleRowIndex : undefined;

  const section = excelContent.slice(titleIndex + 1, endIndex).filter((row) => {
    const isEmpty = isEmptyCellRow(row);
    const isHeader = rowIncludes(row, headerCells);

    return !isEmpty && !isHeader;
  });

  return {
    titleIndex,
    endIndex,
    section,
  };
};
