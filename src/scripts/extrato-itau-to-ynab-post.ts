#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/extrato-itau-to-ynab-post.ts
// $ ./src/scripts/extrato-itau-to-ynab-post.ts '/Users/eduardoportilho/Downloads/Extrato Conta Corrente-250920242201.txt' $BUDGET_EDU_2025 $ACCOUNT_EDU_2023_ITAU_CONTA_EDU
// $ ./src/scripts/extrato-itau-to-ynab-post.ts '/Users/eduardoportilho/Downloads/casal-240930.txt' $BUDGET_CASAL $ACCOUNT_ITAU_CASAL

import { EXTRATO_ITAU_PROCESSORS } from "../services/process-extrato-itau/process-extrato-itau";
import { convertItauExtratoToYnabTxs } from "../services/convert-itau-extrato-to-ynab-txs/convert-itau-extrato-to-ynab-txs";
import { processTxs } from "../services/process-txs/process-txs";
import {
  getYnabCliArgsAndReadFile,
  removeDuplicates,
  uploadTxsToYnab,
} from "./common";

(async () => {
  try {
    const { budgetId, accountId, accessToken, content } =
      getYnabCliArgsAndReadFile();

    const importedTxs = convertItauExtratoToYnabTxs({
      content: content,
      accountId,
    });

    // Roda "processors" que transformam txs
    const processedTxs = processTxs({
      txs: importedTxs,
      processors: EXTRATO_ITAU_PROCESSORS,
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
