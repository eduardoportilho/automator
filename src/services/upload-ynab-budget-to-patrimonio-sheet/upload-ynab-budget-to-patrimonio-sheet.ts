import {
  fetchYnabSheet,
  findNextDateCellPosition,
} from "../../services/patrimonio-sheet/patrimonio-sheet";
import {
  YNAB_SHEET_TITLE,
  INVESTIMENTOS_SPREADSHEET_ID,
} from "../../constants";
import { writeSheetRange } from "../../utils/sheets/sheets";
import { YnabBudget } from "../../types";
import { createBudgetEntry } from "../create-budget-entry/create-budget-entry";

export const uploadYnabBudgetToPatrimonioSheet = async (budget: YnabBudget) => {
  // fetch range where data will be writen
  console.log("Fetching YNAB sheet content...");
  const ynabSheetContent = await fetchYnabSheet();

  const datePosition = findNextDateCellPosition(ynabSheetContent);

  // Report is generated in this step
  const budgetEntry = createBudgetEntry({
    sheetContent: ynabSheetContent,
    budget,
  });

  console.log("Writing carteira XP to YNAB sheet...");
  await writeSheetRange({
    spreadsheetId: INVESTIMENTOS_SPREADSHEET_ID,
    sheetTitle: YNAB_SHEET_TITLE,
    startCellA1: datePosition.a1,
    data: budgetEntry,
  });

  console.log(
    `Carteira entry added to "${YNAB_SHEET_TITLE}!${datePosition.a1}"`
  );
};
