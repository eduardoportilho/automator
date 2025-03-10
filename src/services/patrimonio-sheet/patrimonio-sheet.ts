import { CellPosition, SheetContent } from "../../types";
import {
  findCellPosition,
  findFirstEmptyRow,
} from "../../utils/sheet-search/sheet-search";
import {
  INVESTIMENTOS_SHEET_TITLE,
  INVESTIMENTOS_SPREADSHEET_ID,
  NEXT_DATE_ANCHOR,
  YNAB_SHEET_TITLE,
} from "../../constants";
import { getSheetRanges } from "../../utils/sheets/sheets";
import { cellValueEqualsTo } from "../../utils/cell-value/cell-value";

export const fetchPatrimonioSheet = async () => {
  //Read all columns from A to Z
  const [sheetContent] = await getSheetRanges(INVESTIMENTOS_SPREADSHEET_ID, [
    INVESTIMENTOS_SHEET_TITLE, // `Sheet1` refers to all the cells in Sheet1.
  ]);

  return sheetContent;
};

export const fetchYnabSheet = async () => {
  //Read all columns from A to Z
  const [sheetContent] = await getSheetRanges(INVESTIMENTOS_SPREADSHEET_ID, [
    YNAB_SHEET_TITLE, // `Sheet1` refers to all the cells in Sheet1.
  ]);

  return sheetContent;
};

/**
 * Find the cordinates of the "<next-date>" cell
 * @param patrimonioSheetContent
 * @returns cell position or null
 */
export const findNextDateCellPosition = (
  patrimonioSheetContent: SheetContent
): CellPosition | null => {
  const nextDateCellPosition = findCellPosition({
    value: NEXT_DATE_ANCHOR,
    sheetContent: patrimonioSheetContent,
  });

  if (!nextDateCellPosition) {
    console.error(
      `Couldn't find the '${NEXT_DATE_ANCHOR}' anchor in the spreadsheet, aborting... 😢`
    );
    process.exit();
  }

  return nextDateCellPosition;
};

/**
 * 1. Look for the provided date, return null if not found
 * 2. Return sheet content between cols [dateCol, dateCol+3]
 * @param param0
 * @returns
 */
export const findPatrimonioEntryByDate = ({
  date,
  sheetContent,
}: {
  date: string;
  sheetContent: SheetContent;
}): {
  content: SheetContent;
  cellPosition: CellPosition;
} | null => {
  const datePosition = findCellPosition({ value: date, sheetContent });

  if (!datePosition) {
    return null;
  }

  const startCol = datePosition.indexes.col;
  const endColExclusive = startCol + 4;

  const trimmedContent = sheetContent.map((row, index) => {
    if (index === 0) {
      return [date, "", "", "", NEXT_DATE_ANCHOR]; // The range has 4 cols and we move NEXT_DATE_ANCHOR to the next col
    }

    if (row.length <= startCol) {
      return [];
    }
    if (row.length <= endColExclusive) {
      return row.slice(startCol);
    }
    return row.slice(startCol, endColExclusive);
  });

  return {
    cellPosition: datePosition,
    content: trimmedContent,
  };
};

/**
 * Find a section of the sheet by its title.
 * Section rows are: title, empty, header, data..., empty
 * @returns sheet content with section data (ater header and before empty row)
 */
export const findSheetSection = ({
  sectionTitle,
  sheetContent,
}: {
  sectionTitle: string;
  sheetContent: SheetContent;
}): SheetContent | null => {
  const titleIndex = sheetContent.findIndex(
    (row) => row.length > 0 && cellValueEqualsTo(row[0], sectionTitle)
  );

  if (titleIndex < 0) {
    return null;
  }

  const startIndex = titleIndex + 3; // 1: empty row, 2: header, 3: data
  const { index: nextEmptyRowIndex } = findFirstEmptyRow({
    startingAt: startIndex,
    column: 0,
    sheetContent,
  });

  // endIndex is exclusive ; undefined means end of array
  const endOfSectionIndex =
    nextEmptyRowIndex >= 0 ? nextEmptyRowIndex : undefined;

  return sheetContent.slice(startIndex, endOfSectionIndex); // endIndex is exclusive
};

// // // // // // // // // // // // // // // // //
// / // // // // // // // // // // // // // // //
// // // // // // // // // // // // // // // // //

const EXAMPLE_SHEET_CONTENT: SheetContent = [
  ["", "", "2024-10-07", "", "", "", "<next-date>"],
  ["FIIs"],
  [],
  ["Ativo", "Banco", "Qtd", "Cotação", "Posição"],
  ["RZAG11", "XP"],
  ["CDII15", "XP"],
  ["CPTR11", "XP"],
  ["HGRU11", "Safra"],
  ["KNCR11", "Safra"],
  ["KNIP11", "Safra"],
  ["MALL11", "Safra"],
  ["MCCI11", "Safra"],
  ["RBRP11", "Safra"],
  ["RBRR11", "Safra"],
  ["RZTR11", "Safra"],
  ["URPR11", "Safra"],
  ["VRTA11", "Safra"],
  ["XPLG11", "Safra"],
  ["JSAF11", "Safra"],
  ["RZAT11", "Safra"],
  ["BRCYCRR08M10", "Safra"],
  [],
  [],
  ["Ações"],
  [],
  ["Ativo", "Banco", "Qtd", "Cotação", "Posição"],
  ["PETR4", "XP"],
  ["VALE3", "XP"],
  ["BBAS3", "XP"],
  ["PETR3", "XP"],
  ["RAIZ4", "XP"],
  ["EGIE3", "XP"],
  [],
  ["Renda Fixa"],
  [],
  ["Ativo", "Banco", "Qtd", "Preço Unitário", "Posição", "Valor líquido"],
  ["CDB FIBRA - ABR/2025", "XP"],
  ["CDB AGIBANK - ABR/2025", "XP"],
  ["CRA VALE DO TIJUCO - NOV/2025", "XP"],
  ["CRI FINAL PRO IPCA - MATEUS SUPERMERCADOS S/A", "Safra"],
  ["CRA Emissão Terceiros IPCA - BRF BRASIL FOODS S/A", "Safra"],
  ["CRA Emissão Terceiros IPCA - ACO VERDE DO BRASIL S/A", "Safra"],
  [],
  ["Fundos de Investimentos\t\t\t\t\t"],
  [],
  ["Ativo", "Banco", "Qtd", "Preço Unitário", "Posição", "Valor líquido"],
  ["Trend Pós-Fixado FIC FIRF Simples", "XP"],
  ["Trend Investback FIC FIRF Simples", "XP"],
  ["Giant Zarathustra Advisory FIC FIM", "XP"],
  ["Ibiuna Hedge ST Advisory FIC FIM", "XP"],
  ["Crescera Growth Capital V FIP Multi - Classe A", "XP"],
  ["Crescera Growth Classe A - XP Trend PE IV FIRF Simples", "XP"],
  ["MS Global Opportunities Dólar Advisory FIC FIA IE - Resp Limitada", "XP"],
  ["Trend Bolsa Chinesa FIA", "XP"],
];
