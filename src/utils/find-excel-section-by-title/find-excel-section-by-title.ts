import { SheetContent } from "../../types";
import {
  findFirstEmptyRow,
  findFirstNonEmptyRow,
  findRowByColumnValue,
} from "../sheet-search/sheet-search";

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
  excelContent: SheetContent;
  startingAt?: number;
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

  const { index: firstRowIndex } = findFirstNonEmptyRow({
    startingAt: titleIndex + 1,
    column: 0,
    sheetContent: excelContent,
  });
  const { index: lastRowIndex } = findFirstEmptyRow({
    startingAt: firstRowIndex,
    column: 0,
    sheetContent: excelContent,
  });

  const endIndex = lastRowIndex >= 0 ? lastRowIndex : undefined;

  return {
    titleIndex,
    endIndex,
    section: excelContent.slice(firstRowIndex, endIndex),
  };
};
