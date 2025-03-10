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
      // Read from GOOGLE_APPLICATION_CREDENTIALS instead
      // (https://github.com/googleapis/google-api-nodejs-client?tab=readme-ov-file#using-the-google_application_credentials-env-var)
      // keyFile: "private/google-credentials.json",
    });
    const authClient = await auth.getClient();
    const project = await auth.getProjectId();

    return { auth, authClient, project };
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param spreadsheetId
 * @param ranges The A1 notation or R1C1 notation of the range to retrieve values from. (https://developers.google.com/sheets/api/guides/concepts#cell)
 * @param valueRenderOption FORMATTED_VALUE, UNFORMATTED_VALUE, FORMULA (https://developers.google.com/sheets/api/reference/rest/v4/ValueRenderOption)
 * @returns
 */
export const getSheetRanges = async (
  spreadsheetId: string,
  ranges: string[],
  valueRenderOption?: "FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA"
): Promise<SheetContent[]> => {
  try {
    const { auth } = await getAuth();
    // https://developers.google.com/sheets/api/samples/reading#multiple-ranges
    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet
    const result = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges,
      valueRenderOption,
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

export const writeSheetRange = async ({
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
    // https://developers.google.com/sheets/api/samples/writing#multiple-ranges
    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate
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

export const appendToSheet = async ({
  spreadsheetId,
  tableHeaderRangeA1,
  rowsToAppend,
}: {
  spreadsheetId: string;
  tableHeaderRangeA1: string;
  rowsToAppend: (string | number)[][];
}): GaxiosPromise<sheets_v4.Schema$AppendValuesResponse> => {
  try {
    const { auth } = await getAuth();
    // https://developers.google.com/sheets/api/samples/writing#append_values
    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append#InsertDataOption
    return await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: tableHeaderRangeA1,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: rowsToAppend,
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
