#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/carteira-safra-to-sheets.ts
// $ ./src/scripts/carteira-safra-to-sheets.ts '/Users/eduardoportilho/Downloads/carteira-safra.tsv'

import { readFile } from "../utils/file";
import { INVESTIMENTOS_SPREADSHEET_URL } from "../constants";
import { getArgs } from "../utils/scripts";
import { uploadCarteiraToPatrimonioSheet } from "../services/upload-carteira-to-patrimonio-sheet/upload-carteira-to-patrimonio-sheet";
import { convertCarteiraSafraTsvTo } from "../services/convert-carteira-safra-csv-to/convert-carteira-safra-csv-to";

(async () => {
  try {
    const [path] = getArgs({
      requiredCount: 1,
      errorMessage: `Missing arguments. Usage: carteira-safra-to-sheets.ts <path/to/carteira-safra.tsv>`,
    });

    const tsvContent = readFile(path);
    const carteiraSafra = convertCarteiraSafraTsvTo(tsvContent);

    // Send to sheets...
    await uploadCarteiraToPatrimonioSheet(carteiraSafra);

    console.log(
      `Done! Please check the results on ${INVESTIMENTOS_SPREADSHEET_URL}`
    );
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
