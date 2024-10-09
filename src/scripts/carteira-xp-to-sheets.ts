#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/carteira-xp-to-sheets.ts
// $ ./src/scripts/carteira-xp-to-sheets.ts '/Users/eduardoportilho/Downloads/carteira-xp.xlsx' $SHEETS

import { readContentFromXls } from "../utils/excel/excel";
import { convertCarteiraXpXlsTo } from "../services/convert-carteira-xp-xls-to/convert-carteira-xp-xls-to";
import { writeInvestimentoSheetEntry } from "../services/write-investimento-sheet-entry/write-investimento-sheet-entry";
import { fetchPatrimonioSheet } from "../services/fetch-patrimonio-sheet/fetch-patrimonio-sheet";
import { findCellPosition } from "../utils/sheet-search/sheet-search";
import { INVESTIMENTOS_SPREADSHEET_URL, NEXT_DATE_ANCHOR } from "../constants";
import { getArgs } from "../utils/scripts";

(async () => {
  try {
    const [path] = getArgs({
      requiredCount: 1,
      errorMessage: `Missing arguments. Usage:carteira-xp-to-sheets.ts <path/to/carteira-xp.xlsx>`,
    });

    const excelContent = readContentFromXls(path);

    const carteiraXp = convertCarteiraXpXlsTo({
      excelContent,
    });

    // fetch range where data will be writen
    // - Is there an entry for today? fetch it
    // - If not, create it
    console.log("Fetching patrimônio sheet content...");
    const patrimonioSheetContent = await fetchPatrimonioSheet();

    const nextDateCellPosition = findCellPosition({
      value: NEXT_DATE_ANCHOR,
      sheetContent: patrimonioSheetContent,
    });

    if (!nextDateCellPosition) {
      console.error(
        `Couldn't fin the '${NEXT_DATE_ANCHOR}' anchor in the spreadsheet, aborting... 😢`
      );
      process.exit();
    }

    // fill the range with XLS data
    console.log("Writing carteira XP to patrimônio sheet...");
    writeInvestimentoSheetEntry({
      startCellA1: nextDateCellPosition.a1,
      carteira: carteiraXp,
      sheetContent: patrimonioSheetContent,
    });

    console.log(
      `Done! Please check the results on ${INVESTIMENTOS_SPREADSHEET_URL}`
    );
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
