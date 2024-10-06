#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/carteira-xp-to-sheets.ts
// $ ./src/scripts/carteira-xp-to-sheets.ts '/Users/eduardoportilho/Downloads/carteira-xp.xlsx' $SHEETS

import { getCLIArgs } from "./common";
import { readContentFromXls } from "../utils/excel/excel";
import { convertCarteiraXpXlsTo } from "../services/convert-carteira-xp-xls-to/convert-carteira-xp-xls-to";

(async () => {
  try {
    const { budgetId, accountId, accessToken, path } = getCLIArgs();

    const excelContent = readContentFromXls(path);

    const carteira = convertCarteiraXpXlsTo({
      excelContent,
    });

    // upload carteira do gsheets

    console.log("Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
