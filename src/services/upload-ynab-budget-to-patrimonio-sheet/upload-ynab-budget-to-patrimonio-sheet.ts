import {
  fetchYnabSheet,
  findNextDateCellPosition,
} from "../../services/patrimonio-sheet/patrimonio-sheet";
import {
  YNAB_SHEET_TITLE,
  INVESTIMENTOS_SPREADSHEET_ID,
} from "../../constants";
import { writeSheetRange } from "../../utils/sheets/sheets";
import { YnabAccount, YnabBudget } from "../../types";
import { createBudgetEntry } from "../create-budget-entry/create-budget-entry";

export const uploadYnabBudgetToPatrimonioSheet = async (
  budget: YnabBudget,
  accounts: YnabAccount[]
) => {
  // fetch range where data will be writen
  console.log("Fetching YNAB sheet content...");
  const ynabSheetContent = await fetchYnabSheet();

  const datePosition = findNextDateCellPosition(ynabSheetContent);

  const budgetEntry = createBudgetEntry({
    sheetContent: ynabSheetContent,
    budget,
    accounts,
  });

  console.log("Writing carteira XP to YNAB sheet...");
  writeSheetRange({
    spreadsheetId: INVESTIMENTOS_SPREADSHEET_ID,
    sheetTitle: YNAB_SHEET_TITLE,
    startCellA1: datePosition.a1,
    data: budgetEntry,
  });
};
