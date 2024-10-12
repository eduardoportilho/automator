#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/extrato-xp-to-ynab-post.ts
// $ ./src/scripts/extrato-xp-to-ynab-post.ts '/Users/eduardoportilho/Downloads/extrato-xp.xlsx' $BUDGET_EDU_2025 $ACCOUNT_EDU_2025_XP_CONTA_EDU

import { getYnabCliArgs, removeDuplicates, uploadTxsToYnab } from "./common";
import { readContentFromXls } from "../utils/excel/excel";
import { convertExtratoXpXlsxToYnabTxs } from "../services/convert-extrato-xp-xlsx-to-ynab-txs/convert-extrato-xp-xlsx-to-ynab-txs";
import { processTxs } from "../services/process-txs/process-txs";
import { EXTRATO_XP_PROCESSORS } from "../services/process-extrato-xp/process-extrato-xp";

(async () => {
  try {
    const { budgetId, accountId, accessToken, path } = getYnabCliArgs();

    const excelContent = readContentFromXls(path);

    const importedTxs = convertExtratoXpXlsxToYnabTxs({
      excelContent,
      accountId,
    });

    const processedTxs = processTxs({
      txs: importedTxs,
      processors: EXTRATO_XP_PROCESSORS,
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
