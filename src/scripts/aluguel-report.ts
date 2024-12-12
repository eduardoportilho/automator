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
import { readPdf } from "../utils/read-pdf/read-pdf";
import { processArpoadorReport } from "../services/process-arpoador-report/process-arpoador-report";
import {
  processBluechipReport,
  isBlueChipReport,
} from "../services/process-bluechip-report/process-bluechip-report";
import { convertDateFormat, DMY_FORMAT } from "../utils/date/date";
import {
  isEstadiaReport,
  processEstadiaReport,
} from "../services/process-estadia-report/process-estadia-report";
import { appendToSheet } from "../utils/sheets/sheets";

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
    const pdfContent = await readPdf(inputPath);

    // console.log(`>>>---<<<`, pdfContent, `>>>---<<<`);

    const isBlueChip = isBlueChipReport(pdfContent);
    const isEstadia = isEstadiaReport(pdfContent);

    const entry = isBlueChip
      ? processBluechipReport(pdfContent)
      : isEstadia
      ? processEstadiaReport(pdfContent)
      : processArpoadorReport(pdfContent);

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
        outputFormat: isEstadia ? "yyMMdd" : "yyMM",
      }) + ".pdf"
    );

    console.log(`📂 Copying file to "${destinationPath}"...\n`);
    copyFileSync(inputPath, destinationPath);

    console.log("✅ Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
