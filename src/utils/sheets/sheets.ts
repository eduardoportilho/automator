import { google, sheets_v4 } from "googleapis";
import { GaxiosPromise } from "googleapis-common";
import { rangeA1 } from "./cellref";
import { SheetContent } from "../../types";

const sheets = google.sheets("v4");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// Auth using service account.
// Service: sheet-manager (https://console.cloud.google.com/iam-admin/serviceaccounts/details/105327018499911710331?project=dashboard-276016&supportedpurview=project)
// Copy GOOGLE_CREDENTIALS from 1password to private/google-credentials.json
// Sheets should be shared with sheet-manager@dashboard-276016.iam.gserviceaccount.com

const getAuth = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: SCOPES,
      keyFile: "private/google-credentials.json",
    });
    const authClient = await auth.getClient();
    const project = await auth.getProjectId();

    return { auth, authClient, project };
  } catch (err) {
    console.log(err);
  }
};

export const getSheetRanges = async (
  spreadsheetId: string,
  ranges: string[]
): Promise<SheetContent[]> => {
  try {
    const { auth } = await getAuth();
    const result = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges,
      auth,
    });
    const data = result.data.valueRanges.map(
      (valueRange) => valueRange.values as SheetContent
    );

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const writeRange = async ({
  spreadsheetId,
  sheetTitle,
  startCellA1,
  data,
}: {
  spreadsheetId: string;
  sheetTitle: string;
  startCellA1: string;
  data: (string | number)[][];
}): GaxiosPromise<sheets_v4.Schema$BatchUpdateValuesResponse> => {
  try {
    const rowCount = data.length;
    const colCount = data.reduce((acc, row) => Math.max(acc, row.length), 0);
    const range: string = rangeA1(sheetTitle, startCellA1, rowCount, colCount);
    const rangeValues = [
      {
        range,
        values: data,
      },
    ];

    const { auth } = await getAuth();
    return await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: "RAW",
        data: rangeValues,
      },
      auth,
    });
  } catch (err) {
    console.log(err);
  }
};

export const clearSheet = async (
  spreadsheetId: string,
  sheetTitle: string,
  range: string = "A:Z"
): GaxiosPromise<sheets_v4.Schema$ClearValuesResponse> => {
  try {
    const { auth } = await getAuth();
    return await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${sheetTitle}!${range}`,
      requestBody: {},
      auth,
    });
  } catch (err) {
    console.log(err);
  }
};
