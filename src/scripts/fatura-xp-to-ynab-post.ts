#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/fatura-xp-to-ynab-post.ts
// $ ./src/scripts/fatura-xp-to-ynab-post.ts '/Users/eduardoportilho/Downloads/fatura.csv' $BUDGET_EDU_2025 $ACCOUNT_EDU_2025_XP_CREDITO_EDU

import { convertFaturaXpToYnabTxs } from "../services/convert-fatura-xp-to-ynab-txs/convert-fatura-xp-to-ynab-txs";
import {
  getYnabCliArgsAndReadFile,
  removeDuplicates,
  uploadTxsToYnab,
} from "./common";
import { processTxs } from "../services/process-txs/process-txs";
import { FATURA_XP_PROCESSORS } from "../services/process-fatura-xp/process-fatura-xp";

(async () => {
  try {
    const { budgetId, accountId, accessToken, content } =
      getYnabCliArgsAndReadFile();

    const importedTxs = convertFaturaXpToYnabTxs({
      content,
      accountId,
    });

    const processedTxs = processTxs({
      txs: importedTxs,
      processors: FATURA_XP_PROCESSORS,
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
