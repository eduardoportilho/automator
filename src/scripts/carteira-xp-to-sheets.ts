#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/carteira-xp-to-sheets.ts
// $ ./src/scripts/carteira-xp-to-sheets.ts '/Users/eduardoportilho/Downloads/carteira-xp.xlsx'

import { readContentFromXls } from "../utils/excel/excel";
import { convertCarteiraXpXlsTo } from "../services/convert-carteira-xp-xls-to/convert-carteira-xp-xls-to";
import { INVESTIMENTOS_SPREADSHEET_URL } from "../constants";
import { getArgs } from "../utils/scripts";
import { uploadCarteiraToPatrimonioSheet } from "../services/upload-carteira-to-patrimonio-sheet/upload-carteira-to-patrimonio-sheet";

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

    // Send to sheets...
    await uploadCarteiraToPatrimonioSheet(carteiraXp);

    console.log(
      `Done! Please check the results on ${INVESTIMENTOS_SPREADSHEET_URL}`
    );
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
