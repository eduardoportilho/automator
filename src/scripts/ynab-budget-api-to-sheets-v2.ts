#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/ynab-budget-api-to-sheets-v2.ts
// $ ./src/scripts/ynab-budget-api-to-sheets-v2.ts $BUDGET_EDU_2025 $YNAB_ACCESS_TOKEN
// $ ./src/scripts/ynab-budget-api-to-sheets-v2.ts $BUDGET_EDU_2025 $YNAB_ACCESS_TOKEN 2025-06-01

import { PATRM_V2_SPREADSHEET_URL } from "../constants";
import { getArgs } from "../utils/scripts";
import { fetchYnabBudget } from "../services/fetch-ynab-txs/fetch-ynab-txs";
import { uploadYnabBudgetToNewSheet } from "../services/upload-ynab-budget-to-new-sheet/upload-ynab-budget-to-new-sheet";

(async () => {
  try {
    const [budgetId, accessToken, month] = getArgs({
      requiredCount: 2,
      errorMessage: `Missing arguments. Usage: ynab-budget-api-to-sheets-v2.ts <budget-id> <access-token> <?yyyy-MM-01?>`,
    });

    const ynabBudget = await fetchYnabBudget({
      budgetId,
      accessToken,
      month,
    });

    // Send to sheets...
    await uploadYnabBudgetToNewSheet(ynabBudget);

    console.log(
      `Done! Please check the results on ${PATRM_V2_SPREADSHEET_URL}`
    );
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
