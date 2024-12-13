#!/usr/bin/env ts-node

// $ ts-node ./src/scripts/aluguel-report.ts input.pdf
//  or
// $ chmod +x ./src/scripts/*.*
// $ ./src/scripts/aluguel-report.ts input.pdf
import { CONTROLE_SPREADSHEET_ID } from "../constants";
import { getArgs } from "../utils/scripts";
import { appendToSheet } from "../utils/sheets/sheets";
import { readAluguelReportPdf } from "../services/read-aluguel-report-pdf/read-aluguel-report-pdf";

(async () => {
  try {
    const [inputPath] = getArgs({
      requiredCount: 1,
      errorMessage: `Missing arguments. Usage: aluguel-report-to-sheets.ts <path/to/file.pdf>`,
    });

    console.log(`🔦 Reading PDF...\n`);

    const { entry } = await readAluguelReportPdf(inputPath);

    // console.log(`>>>---<<<`, entry, `>>>---<<<\n`);

    // append to alugueis gsheet (entry):
    // - const sheetRowEntry = buildSheetRowEntry(entry)
    // - appendToSheet(sheetRowEntry, 'sheet', 'page')

    console.log(`🛫 Appending to "🕹️ Controle (2025) 🕹️" sheet...\n`);

    appendToSheet({
      spreadsheetId: CONTROLE_SPREADSHEET_ID,
      tableHeaderRangeA1: "'🏡Alugueis'!A1:J1",
      rowsToAppend: [
        [
          entry.imovel,
          entry.mesCompetencia,
          entry.dataPagamento,
          entry.valorAluguel,
          entry.taxaAdministracao,
          entry.valorIr,
          entry.valorRepasse,
          entry.dataEntrada,
          entry.dataSaida,
          entry.diariaLiquida,
        ],
      ],
    });

    console.log("✅ Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
