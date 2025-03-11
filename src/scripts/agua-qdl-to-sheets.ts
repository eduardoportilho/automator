#!/usr/bin/env ts-node

// $ ts-node ./src/scripts/agua-qdl-to-sheets.ts input.pdf
//  or
// $ chmod +x ./src/scripts/*.*
// $ ./src/scripts/agua-qdl-to-sheets.ts input.pdf
import { CONTROLE_SPREADSHEET_ID } from "../constants";
import { getArgs } from "../utils/scripts";
import { appendToSheet } from "../utils/sheets/sheets";
import { readAguaQdl } from "../services/read-agua-qdl/read-agua-qdl";
import { parseAmountBR } from "../utils/currency/currency";

(async () => {
  try {
    const [inputPath] = getArgs({
      requiredCount: 1,
      errorMessage: `Missing arguments. Usage: agua-qdl-to-sheets.ts <path/to/file.pdf>`,
    });

    const {
      dataLeituraAtual,
      medicaoMesAnterior,
      medicaoMes,
      consumoM3,
      calculoBrl,
      valorAPagar,
    } = await readAguaQdl(inputPath);

    console.log(
      `🛫 Appending to "🕹️ Controle (2025) 🕹️/💧Agua QDL" sheet...\n`
    );

    appendToSheet({
      spreadsheetId: CONTROLE_SPREADSHEET_ID,
      tableHeaderRangeA1: `'💧Agua QDL'!A1:J1`,
      rowsToAppend: [
        [
          dataLeituraAtual,
          parseAmountBR(medicaoMesAnterior),
          parseAmountBR(medicaoMes),
          parseAmountBR(consumoM3),
          parseAmountBR(calculoBrl),
          parseAmountBR(valorAPagar),
        ],
      ],
    });

    console.log("✅ Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
