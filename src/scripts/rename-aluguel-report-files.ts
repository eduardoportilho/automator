import path from "path";
import {
  MARIA_QUITERIA,
  COPA_542,
  OPEN_MALL,
  GRANJA_BRASIL,
  MILLENIUM,
  GTC,
  LEBLON,
} from "../constants";
import { listFiles, renameFile } from "../utils/file";
import { getArgs } from "../utils/scripts";
import { readAluguelReportPdf } from "../services/read-aluguel-report-pdf/read-aluguel-report-pdf";
import { convertDateFormat } from "../utils/date/date";

const ALUGUEIS_PREFIX_MAP: Record<string, string> = {
  [MARIA_QUITERIA]: "mquit",
  [COPA_542]: "copa542",
  [OPEN_MALL]: "opmll",
  [GRANJA_BRASIL]: "granja",
  [MILLENIUM]: "milln",
  [GTC]: "gtc",
  [LEBLON]: "ata401",
};

(async () => {
  try {
    const [folderPath] = getArgs({
      requiredCount: 1,
      errorMessage: `Missing arguments. Usage: rename-aluguel-report-files.ts <path/to/folder>`,
    });

    const files = listFiles({
      folderPath,
      extension: "pdf",
    });

    for (const filePath of files) {
      const { entry } = await readAluguelReportPdf(filePath);
      const original = path.parse(filePath);
      const prefix = ALUGUEIS_PREFIX_MAP[entry.imovel];
      const dtref = convertDateFormat({
        date: entry.dataPagamento,
        inputFormat: "dd/MM/yyyy",
        outputFormat: "yyMM",
      });
      const newName = `${prefix}-${dtref}-${original.name}`;

      // console.log(`⚙️ Renaming "${filePath}" to "${newName}"...\n`);

      renameFile(filePath, newName);
    }
    console.log("✅ Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
