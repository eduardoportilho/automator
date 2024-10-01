#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/extrato-itau-to-ynab-post.ts
// $ ./src/scripts/extrato-itau-to-ynab-post.ts '/Users/eduardoportilho/Downloads/Extrato Conta Corrente-250920242201.txt' $BUDGET_EDU $ITAU_EDU
// $ ./src/scripts/extrato-itau-to-ynab-post.ts '/Users/eduardoportilho/Downloads/casal-240930.txt' $BUDGET_CASAL $ITAU_CASAL

import { uploadYnabTxs } from "../services/upload-ynab-txs/upload-ynab-txs";
import { convertItauExtratoToYnabTxs } from "../services/convert-itau-extrato-to-ynab-tx/convert-itau-extrato-to-ynab-tx";
import { readFile } from "../utils/file";
import { getArgs, checkEnvVars } from "../utils/scripts";
import { removeExistingYnabTxs } from "../services/remove-existing-ynab-txs/remove-existing-ynab-txs";

(async () => {
  try {
    const [pathExtrato, budgetId, accountId, accessTokenFromArgs] = getArgs({
      requiredCount: 3,
      errorMessage:
        "Missing arguments. Usage: extrato-itau-to-ynab-post.ts <path/to/extrato.txt> <budget-id> <account-id>",
    });
    let accessToken = accessTokenFromArgs;
    if (!accessToken) {
      const [accessTokenFromEnv] = checkEnvVars(["YNAB_ACCESS_TOKEN"]);
      accessToken = accessTokenFromEnv;
    }

    const contentExtrato = readFile(pathExtrato);
    const importedTxs = convertItauExtratoToYnabTxs({
      content: contentExtrato,
      accountId,
    });
    console.log("Fetching transactions from YNAB to remove duplicates...");
    const { uniqueTxs, originalCount, duplicateCount, uniqueCount } =
      await removeExistingYnabTxs({
        budgetId,
        accountId,
        accessToken,
        originalTxs: importedTxs,
      });
    console.log(
      `Found ${uniqueCount} new in ${originalCount} imported transactions (${duplicateCount} duplicates)`
    );

    console.log(`Uploading ${uniqueTxs.length} new transactions...`);
    await uploadYnabTxs({
      budgetId: budgetId,
      accessToken,
      txs: uniqueTxs,
    });
    console.log("Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
