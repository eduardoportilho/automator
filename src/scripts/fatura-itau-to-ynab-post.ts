#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/fatura-itau-to-ynab-post.ts
// $ ./src/scripts/fatura-itau-to-ynab-post.ts '/Users/eduardoportilho/Downloads/itau-visa.xls' $BUDGET_EDU $ACCOUNT_ITAU_CREDITO_EDU

import { getCLIArgs, removeDuplicates, uploadTxsToYnab } from "./common";
import { readContentFromXls } from "../utils/excel/excel";
import { convertFaturaItauXlsToYnabTxs } from "../services/convert-fatura-itau-xls-to-ynab-txs/convert-fatura-itau-xls-to-ynab-txs";

(async () => {
  try {
    const { budgetId, accountId, accessToken, path } = getCLIArgs();

    const excelContent = readContentFromXls(path);

    const importedTxs = convertFaturaItauXlsToYnabTxs({
      excelContent,
      accountId,
    });

    const processedTxs = importedTxs;
    // const processedTxs = processTxs({
    //   txs: importedTxs,
    //   processors: FATURA_XP_PROCESSORS,
    // });

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
