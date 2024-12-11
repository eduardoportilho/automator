#!/usr/bin/env ts-node

// $ ts-node ./src/scripts/read-pdf.ts
//  or
// $ chmod +x ./src/scripts/*.*
// $ ./src/scripts/read-pdf.ts input.pdf
import {
  MARIA_QUITERIA,
  COPA_542,
  OPEN_MALL,
  GRANJA_BRASIL,
  MILLENIUM,
} from "../constants";
import nodePath from "path";
import { copyFileSync } from "fs";
import { getArgs } from "../utils/scripts";
import { readPdf } from "../utils/read-pdf/read-pdf";
import { processArpoadorReport } from "../services/process-arpoador-report/process-arpoador-report";
import {
  processBluechipReport,
  isMilleniumReport,
} from "../services/process-bluechip-report/process-bluechip-report";
import { convertDateFormat, DMY_FORMAT } from "../utils/date/date";

const ALUGUEIS_ROOT_FOLDER_PATH =
  "/Users/eduardoportilho/My Drive (eduardo.portilho@gmail.com)/_EPPCloud/__Financas/__2023/Alugueis";

const ALUGUEIS_SUBFOLDER_MAP: Record<string, string> = {
  [MARIA_QUITERIA]: "Maria Quitéria",
  [COPA_542]: "Copa 542",
  [OPEN_MALL]: "Open Mall",
  [GRANJA_BRASIL]: "Granja Brasil",
  [MILLENIUM]: "Millenium",
};

(async () => {
  try {
    const [inputPath] = getArgs({
      requiredCount: 1,
      errorMessage: `Missing arguments. Usage: read-pdf.ts <path/to/file.pdf>`,
    });

    const pdfContent = await readPdf(inputPath);

    // console.log(`>>>---<<<`);
    // console.log(pdfContent);
    // console.log(`>>>---<<<`);

    const isMillenium = isMilleniumReport(pdfContent);
    const entry = isMillenium
      ? processBluechipReport(pdfContent)
      : processArpoadorReport(pdfContent);

    console.log(entry);

    // append to alugueis gsheet (entry)

    const destinationPath = nodePath.join(
      ALUGUEIS_ROOT_FOLDER_PATH,
      ALUGUEIS_SUBFOLDER_MAP[entry.imovel],
      convertDateFormat({
        date: entry.dataPagamento,
        inputFormat: DMY_FORMAT,
        outputFormat: "yyMM",
      }) + ".pdf"
    );

    console.log(`Copying file to "${destinationPath}"...`);
    // copyFileSync(inputPath, destinationPath);

    console.log("Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
