#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/extrato-safra-csv-to-ynab-post.ts
// $ ./src/scripts/extrato-safra-csv-to-ynab-post.ts '/Users/eduardoportilho/Downloads/extrato-safra.csv' $BUDGET_EDU_2025 $ACCOUNT_EDU_2025_SAFRA_CONTA_EDU

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

// /Users/eduardoportilho/dev/personal/automator/src/scripts/extrato-safra-csv-to-ynab-post.ts /Users/eduardoportilho/hazel/extrato-safra-csv-to-ynab/extrato-safra.csv 0ef9ba7f-ca2d-473c-b874-5b979feb663a 62235cea-db9a-438c-94ff-fdde7142d142 BoRmZFCzY8n1f5KyFWoMSgJ8XyIAagFpLFoTB7T-464
