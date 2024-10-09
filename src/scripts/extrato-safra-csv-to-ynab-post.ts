#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/extrato-safra-csv-to-ynab-post.ts
// $ ./src/scripts/extrato-safra-csv-to-ynab-post.ts '/Users/eduardoportilho/Downloads/extrato-safra.csv' $BUDGET_EDU $ACCOUNT_SAFRA_EDU

import { processTxs } from "../services/process-txs/process-txs";
import {
  getYnabCliArgsAndReadFile,
  removeDuplicates,
  uploadTxsToYnab,
} from "./common";
import { convertSafraExtratoToYnabTxs } from "../services/convert-safra-extrato-to-ynab-txs/convert-safra-extrato-to-ynab-txs";
import { EXTRATO_SAFRA_PROCESSORS } from "../services/process-extrato-safra/process-extrato-safra";

(async () => {
  try {
    const { budgetId, accountId, accessToken, content } =
      getYnabCliArgsAndReadFile();

    const importedTxs = convertSafraExtratoToYnabTxs({
      content: content,
      accountId,
    });

    const processedTxs = processTxs({
      txs: importedTxs,
      processors: EXTRATO_SAFRA_PROCESSORS,
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
