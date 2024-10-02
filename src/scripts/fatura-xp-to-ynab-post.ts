#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/fatura-xp-to-ynab-post.ts
// $ ./src/scripts/fatura-xp-to-ynab-post.ts '/Users/eduardoportilho/Downloads/fatura.csv' $BUDGET_EDU $ACCOUNT_XP_CREDITO_EDU

import { uploadYnabTxs } from "../services/upload-ynab-txs/upload-ynab-txs";
import { convertFaturaXpToYnabTxs } from "../services/convert-fatura-xp-to-ynab-txs/convert-fatura-xp-to-ynab-txs";
import { readFile } from "../utils/file";
import { getArgs, getEnvVars } from "../utils/scripts";
import { removeExistingYnabTxs } from "../services/remove-existing-ynab-txs/remove-existing-ynab-txs";
import { createYnabCsvContent } from "../services/create-ynab-csv/create-ynab-csv";

(async () => {
  try {
    const [pathExtrato, budgetId, accountId, accessTokenFromArgs] = getArgs({
      requiredCount: 3,
      errorMessage:
        "Missing arguments. Usage: fatura-xp-to-ynab-post.ts <path/to/extrato.txt> <budget-id> <account-id> <?accessToken?>",
    });

    let accessToken = accessTokenFromArgs;
    if (!accessToken) {
      const [accessTokenFromEnv] = getEnvVars(["YNAB_ACCESS_TOKEN"]);
      accessToken = accessTokenFromEnv;
    }

    const contentExtrato = readFile(pathExtrato);
    const importedTxs = convertFaturaXpToYnabTxs({
      content: contentExtrato,
      accountId,
    });

    console.log("Fetching transactions from YNAB to remove duplicates...");
    const { uniqueTxs, duplicateTxs } = await removeExistingYnabTxs({
      budgetId,
      accountId,
      accessToken,
      originalTxs: importedTxs,
    });
    console.log(
      `Found ${uniqueTxs.length} new in ${importedTxs.length} imported transactions`
    );
    if (duplicateTxs.length > 0) {
      console.log(
        "Duplicates:",
        duplicateTxs.map(
          ({ date, payee_name, amount }) => `${date}  ${payee_name}  ${amount}`
        ),
        "\n"
      );
    }

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
