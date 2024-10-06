import {
  ExcelContent,
  findFirstEmptyRow,
  findFirstNonEmptyRow,
  findRowByColumnValue,
} from "../excel/excel";

/**
 * Find a section with one content block:
 * - Find the row with the provided title (at col 0)
 * - Find the next not-empty row
 * - Find the next empty row - section is between those rows
 * @param
 * - title: section title
 * @returns
 * - titleIndex: title row index
 * - endIndex: index of the empty row after section
 * - section: rows between thos indexes
 */
export const findExcelSectionByTitle = ({
  title,
  excelContent,
  startingAt = 0,
}: {
  title: string;
  excelContent: ExcelContent;
  startingAt?: number;
}): {
  titleIndex: number;
  endIndex: number;
  section: ExcelContent;
} => {
  const { index: titleIndex } = findRowByColumnValue({
    value: title,
    column: 0,
    excelContent,
    startingAt,
  });

  if (titleIndex < 0) {
    return {
      titleIndex: -1,
      endIndex: -1,
      section: [],
    };
  }

  const { index: firstRowIndex } = findFirstNonEmptyRow({
    startingAt: titleIndex + 1,
    column: 0,
    excelContent,
  });
  const { index: lastRowIndex } = findFirstEmptyRow({
    startingAt: firstRowIndex,
    column: 0,
    excelContent,
  });

  const endIndex = lastRowIndex >= 0 ? lastRowIndex : undefined;

  return {
    titleIndex,
    endIndex,
    section: excelContent.slice(firstRowIndex, endIndex),
  };
};
