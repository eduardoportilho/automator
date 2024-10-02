import {
  ExcelContent,
  ExcelRowValue,
  findRowByColumnValue,
} from "../../utils/excel/excel";
import { YnabTx } from "../../types";
import {
  parseAmountBR,
  convertAmountToYnab,
} from "../../utils/currency/currency";
import {
  convertDateFormat,
  DMY_FORMAT,
  parseDateStringIfValid,
  YNAB_DATE_FORMAT,
} from "../../utils/date/date";

/**
 *
 * @param row Example:
 *  ["01/09/2024", "Dl*google Gsuite", "", 168]
 * @returns
 */
const convertFaturaItauRowToYnabTx = ({
  row,
  accountId,
}: {
  row: ExcelRowValue;
  accountId?: string;
}): YnabTx | null => {
  // [date, desc, empty, value]
  if (row.length < 4) {
    return null;
  }

  const dateDMY = row[0];
  const parsedDate = parseDateStringIfValid({
    value: dateDMY,
    dateFormat: DMY_FORMAT,
  });

  if (!parsedDate) {
    return null;
  }

  const numericAmount = row[3];

  if (typeof numericAmount !== "number") {
    return null;
  }

  const description = row[1];

  if (typeof description !== "string") {
    return null;
  }

  const dateYnab = convertDateFormat({
    date: dateDMY as string,
    inputFormat: DMY_FORMAT,
    outputFormat: YNAB_DATE_FORMAT,
  });

  return {
    account_id: accountId,
    date: dateYnab,
    payee_name: description,
    amount: convertAmountToYnab({ amount: numericAmount, invert: true }),
    flag_color: "purple",
  };
};

/**
 * Convert fatura itau excel content into ynab transactions
 * @param content Example:
 *  ["01/09/2024", "Dl*google Gsuite", "", 168]
 * @param accountId Example: 2d879295-30b5-4450-aabb-17fa1b64b202
 * @returns Example: {accountId, 2024-09-16, PIX TRANSF IMOBILI06/09, -1421630}
 */
export const convertFaturaItauXlsToYnabTxs = ({
  excelContent,
  accountId,
}: {
  excelContent: ExcelContent;
  accountId?: string;
}): YnabTx[] => {
  const { index: intlIndex } = findRowByColumnValue({
    excelContent,
    column: 0,
    value: "lançamentos internacionais",
  });

  let trimmedExcelContent = excelContent;
  if (intlIndex >= 0) {
    trimmedExcelContent = excelContent.slice(0, intlIndex);
  }

  const ynabTxs: YnabTx[] = [];

  for (let index = 0; index < trimmedExcelContent.length; index++) {
    const row = trimmedExcelContent[index];
    try {
      const ynabTx = convertFaturaItauRowToYnabTx({ row, accountId });
      if (ynabTx) {
        ynabTxs.push(ynabTx);
      }
    } catch (error) {
      // What to do? abort? skip? log?
      console.error(error);
    }
  }
  return ynabTxs;
};
