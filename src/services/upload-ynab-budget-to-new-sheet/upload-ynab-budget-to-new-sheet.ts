import { PATRM_V2_SPREADSHEET_ID } from "../../constants";
import { writeToNewSheet } from "../../utils/sheets/sheets";
import { YnabBudget } from "../../types";
import { convertYnabToAmount } from "../../utils/currency/currency";
import { todayString } from "../../utils/date/date";

/**
 * Convert YnabResponse to sheet data.
 * @example
 * ```
 * Cat. Group | Category    | yyyy-MM
 * <group>    | <category>  | 12345
 *
 * Account    |             | yyyy-MM-dd
 * <account>  |             | 12345
 * ```
 */
const ynabResponseToSheet = (budget: YnabBudget) => {
  return [
    ["Cat. Group", "Category", budget.month],
    ...budget.categoryGroups.flatMap((catGroup) => {
      return catGroup.categories.map((category) => {
        return [
          catGroup.name,
          category.name,
          convertYnabToAmount(category?.activity ?? 0),
        ];
      });
    }),
    [""],
    ["Account", "", todayString()],
    ...budget.accounts.map((account) => [
      account.name,
      "",
      convertYnabToAmount(account.balance),
    ]),
  ];
};

export const uploadYnabBudgetToNewSheet = async (budget: YnabBudget) => {
  const budgetEntry = ynabResponseToSheet(budget);
  const sheetTitle = `ynab.${todayString()}`;

  await writeToNewSheet({
    spreadsheetId: PATRM_V2_SPREADSHEET_ID,
    sheetTitle,
    data: budgetEntry,
  });

  console.log(`Ynab entry added to "${sheetTitle}"`);
};
