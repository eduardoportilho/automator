#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/fatura-itau-to-ynab-post.ts
// $ ./src/scripts/fatura-itau-to-ynab-post.ts '/Users/eduardoportilho/Downloads/itau-visa.xls' $BUDGET_EDU_2025 $ACCOUNT_EDU_2025_ITAU_CREDITO_EDU

import { getYnabCliArgs, removeDuplicates, uploadTxsToYnab } from "./common";
import { readContentFromXls } from "../utils/excel/excel";
import { convertFaturaItauXlsToYnabTxs } from "../services/convert-fatura-itau-xls-to-ynab-txs/convert-fatura-itau-xls-to-ynab-txs";
import { FATURA_ITAU_PROCESSORS } from "../services/process-fatura-itau/process-fatura-itau";
import { processTxs } from "../services/process-txs/process-txs";

(async () => {
  try {
    const { budgetId, accountId, accessToken, path } = getYnabCliArgs();

    const excelContent = readContentFromXls(path);

    const importedTxs = convertFaturaItauXlsToYnabTxs({
      excelContent,
      accountId,
    });

    const processedTxs = processTxs({
      txs: importedTxs,
      processors: FATURA_ITAU_PROCESSORS,
    });

    const uniqueTxs = await removeDuplicates({
      budgetId,
      accountId,
      accessToken,
      txs: processedTxs,
    });

    await uploadTxsToYnab({
      budgetId,
      accessToken,
      txs: uniqueTxs,
    });

    console.log("Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
