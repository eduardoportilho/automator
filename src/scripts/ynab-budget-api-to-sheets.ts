#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/ynab-budget-api-to-sheets.ts
// $ ./src/scripts/ynab-budget-api-to-sheets.ts $BUDGET_EDU_2025 $YNAB_ACCESS_TOKEN
// $ ./src/scripts/ynab-budget-api-to-sheets.ts $BUDGET_EDU_2025 $YNAB_ACCESS_TOKEN 2024-10-01

import { INVESTIMENTOS_SPREADSHEET_URL } from "../constants";
import { getArgs } from "../utils/scripts";
import { uploadYnabBudgetToPatrimonioSheet } from "../services/upload-ynab-budget-to-patrimonio-sheet/upload-ynab-budget-to-patrimonio-sheet";
import { fetchYnabBudget } from "../services/fetch-ynab-txs/fetch-ynab-txs";

(async () => {
  try {
    const [budgetId, accessToken, month] = getArgs({
      requiredCount: 2,
      errorMessage: `Missing arguments. Usage: ynab-budget-api-to-sheets.ts <budget-id> <access-token> <?yyyy-MM-01?>`,
    });

    const ynabBudget = await fetchYnabBudget({
      budgetId,
      accessToken,
      month,
    });

    // Send to sheets...
    // Report is generated in this step
    await uploadYnabBudgetToPatrimonioSheet(ynabBudget);

    console.log(
      `Done! Please check the results on ${INVESTIMENTOS_SPREADSHEET_URL}`
    );
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
