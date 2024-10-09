import { format } from "date-fns";
import {
  fetchPatrimonioSheet,
  findNextDateCellPosition,
} from "../../services/patrimonio-sheet/patrimonio-sheet";
import {
  INVESTIMENTOS_SHEET_TITLE,
  INVESTIMENTOS_SPREADSHEET_ID,
} from "../../constants";
import { YNAB_DATE_FORMAT } from "../../utils/date/date";
import { writeSheetRange } from "../../utils/sheets/sheets";
import { createPatrimonioEntry } from "../../services/create-patrimonio-entry/create-patrimonio-entry";
import { findCellPosition } from "../../utils/sheet-search/sheet-search";
import { readCarteiraFromPatrimonioSheet } from "../../services/read-carteira-from-patrimonio-sheet/read-carteira-from-patrimonio-sheet";
import { mergeCarteiras } from "../../services/merge-carteiras/merge-carteiras";
import { Carteira } from "../../types";

export const uploadCarteiraToPatrimonioSheet = async (
  newCarteira: Carteira
) => {
  // fetch range where data will be writen
  console.log("Fetching patrimônio sheet content...");
  const patrimonioSheetContent = await fetchPatrimonioSheet();
  const processingDate = format(new Date(), YNAB_DATE_FORMAT);

  // Look for processing date on the sheet
  let datePosition = findCellPosition({
    value: processingDate,
    sheetContent: patrimonioSheetContent,
  });
  let carteiraOnDate = newCarteira;

  // Is there an entry on this date?
  if (datePosition) {
    const existingCarteira = readCarteiraFromPatrimonioSheet({
      date: processingDate,
      sheetContent: patrimonioSheetContent,
    });

    carteiraOnDate = mergeCarteiras(existingCarteira, newCarteira);
  } else {
    datePosition = findNextDateCellPosition(patrimonioSheetContent);
  }

  const patrimonioEntry = createPatrimonioEntry({
    date: processingDate,
    sheetContent: patrimonioSheetContent,
    carteira: carteiraOnDate,
  });

  console.log("Writing carteira XP to patrimônio sheet...");
  writeSheetRange({
    spreadsheetId: INVESTIMENTOS_SPREADSHEET_ID,
    sheetTitle: INVESTIMENTOS_SHEET_TITLE,
    startCellA1: datePosition.a1,
    data: patrimonioEntry,
  });
};
