#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/ynab-budget-tsv-to-sheets.ts
// $ ./src/scripts/ynab-budget-tsv-to-sheets.ts '/Users/eduardoportilho/Downloads/ynab-budget.tsv' 2024/09 $BUDGET_EDU_2025 $YNAB_ACCESS_TOKEN

import { readFile } from "../utils/file";
import { INVESTIMENTOS_SPREADSHEET_URL } from "../constants";
import { getArgs } from "../utils/scripts";
import { convertYnabBudgetTsvTo } from "../services/convert-ynab-budget-tsv-to/convert-ynab-budget-tsv-to";
import { uploadYnabBudgetToPatrimonioSheet } from "../services/upload-ynab-budget-to-patrimonio-sheet/upload-ynab-budget-to-patrimonio-sheet";
import { fetchYnabAccounts } from "../services/fetch-ynab-txs/fetch-ynab-txs";

(async () => {
  try {
    const [path, month, budgetId, accessToken] = getArgs({
      requiredCount: 4,
      errorMessage: `Missing arguments. Usage: ynab-budget-tsv-to-sheets.ts <path/to/ynab-budget.tsv> <YYYY-MM> <budget-id> <access-token>`,
    });

    const tsvContent = readFile(path);
    const ynabBudget = convertYnabBudgetTsvTo(tsvContent, month);
    const accounts = await fetchYnabAccounts({
      budgetId,
      accessToken,
    });

    // Send to sheets...
    await uploadYnabBudgetToPatrimonioSheet(ynabBudget, accounts);

    console.log(
      `Done! Please check the results on ${INVESTIMENTOS_SPREADSHEET_URL}`
    );
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
