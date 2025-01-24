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

    const { entry, isAirbnb } = await readAluguelReportPdf(inputPath);

    // console.log(`>>>---<<<`, entry, `>>>---<<<\n`);

    // AirBnb entry:
    // Imóvel                        | Dt. Pgto   | Aluguel  | Taxa adm. | Valor repasse | Num. diárias | Diária liq.
    // Ataulfo de Paiva 734, Apt 401 | 16/02/2024 | 8.260,89 | 1.652,18  | 6.257,59      | 5            | 1.251,52

    // Aluguel entry:
    // Imóvel                | Competência | Dt. Pgto   | Aluguel   | Taxa adm. | IR       | Valor repasse
    // Rua Maria Quitéria 95 | 06/2024     | 01/07/2024 | 17.468,12 | 873,41    | 3.908,21 | 14.370,73

    const tituloPlanilha = isAirbnb ? "🏨Airbnb" : "🏡Alugueis";
    const sheetRow = isAirbnb
      ? [
          entry.imovel,
          entry.dataPagamento,
          entry.valorAluguel,
          entry.taxaAdministracao,
          entry.valorRepasse,
          entry.numeroDiarias,
          entry.diariaLiquida,
        ]
      : [
          entry.imovel,
          entry.mesCompetencia,
          entry.dataPagamento,
          entry.valorAluguel,
          entry.taxaAdministracao,
          entry.valorIr,
          entry.valorRepasse,
        ];

    console.log(
      `🛫 Appending to "🕹️ Controle (2025) 🕹️/${tituloPlanilha}" sheet...\n`
    );

    appendToSheet({
      spreadsheetId: CONTROLE_SPREADSHEET_ID,
      tableHeaderRangeA1: `'${tituloPlanilha}'!A1:J1`,
      rowsToAppend: [sheetRow],
    });

    console.log("✅ Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
