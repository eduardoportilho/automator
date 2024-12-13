#!/usr/bin/env ts-node

// $ ts-node ./src/scripts/aluguel-report.ts input.pdf
//  or
// $ chmod +x ./src/scripts/*.*
// $ ./src/scripts/aluguel-report.ts input.pdf
import {
  MARIA_QUITERIA,
  COPA_542,
  OPEN_MALL,
  GRANJA_BRASIL,
  MILLENIUM,
  GTC,
  LEBLON,
  CONTROLE_SPREADSHEET_ID,
} from "../constants";
import nodePath from "path";
import { copyFileSync } from "fs";
import { getArgs } from "../utils/scripts";
import { convertDateFormat, DMY_FORMAT } from "../utils/date/date";
import { appendToSheet } from "../utils/sheets/sheets";
import { readAluguelReportPdf } from "../services/read-aluguel-report-pdf/read-aluguel-report-pdf";

const ALUGUEIS_ROOT_FOLDER_PATH =
  "/Users/eduardoportilho/My Drive (eduardo.portilho@gmail.com)/_EPPCloud/__Financas/__2023/Alugueis";

const ALUGUEIS_SUBFOLDER_MAP: Record<string, string> = {
  [MARIA_QUITERIA]: "Maria Quitéria",
  [COPA_542]: "Copa 542",
  [OPEN_MALL]: "Open Mall",
  [GRANJA_BRASIL]: "Granja Brasil",
  [MILLENIUM]: "Millenium",
  [GTC]: "Airbnb - GTC e Leblon",
  [LEBLON]: "Airbnb - GTC e Leblon",
};

(async () => {
  try {
    const [inputPath] = getArgs({
      requiredCount: 1,
      errorMessage: `Missing arguments. Usage: read-pdf.ts <path/to/file.pdf>`,
    });

    console.log(`🔦 Reading PDF...\n`);

    const { entry, isAirbnb } = await readAluguelReportPdf(inputPath);

    console.log(`>>>---<<<`, entry, `>>>---<<<\n`);

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

    const destinationPath = nodePath.join(
      ALUGUEIS_ROOT_FOLDER_PATH,
      ALUGUEIS_SUBFOLDER_MAP[entry.imovel],
      convertDateFormat({
        date: entry.dataPagamento,
        inputFormat: DMY_FORMAT,
        outputFormat: isAirbnb ? "yyMMdd" : "yyMM",
      }) + ".pdf"
    );

    console.log(`📂 Copying file to "${destinationPath}"...\n`);
    // copyFileSync(inputPath, destinationPath);

    console.log("✅ Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
