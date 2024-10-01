import { YnabTx } from "../../types";
import {
  parseAmountBR,
  convertAmountToYnab,
} from "../../utils/currency/currency";
import {
  convertDateFormat,
  DMY_FORMAT,
  YNAB_DATE_FORMAT,
} from "../../utils/date/date";
import { splitRows } from "../../utils/rows";

const convertItauRowToYnabTx = ({
  row,
  accountId,
}: {
  row: string;
  accountId?: string;
}): YnabTx | null => {
  // Ignore empty rows
  if (row.trim().length === 0) {
    return null;
  }

  const cols = row.split(";");
  if (cols.length < 3) {
    throw new Error(`Not enough columns (expected 3). Row content: "${row}"`);
  }
  const [dateDMY, description, amountBR] = cols;
  const dateYnab = convertDateFormat({
    date: dateDMY,
    inputFormat: DMY_FORMAT,
    outputFormat: YNAB_DATE_FORMAT,
  });
  const amount = parseAmountBR(amountBR);

  return {
    account_id: accountId,
    date: dateYnab,
    payee_name: description,
    amount: convertAmountToYnab(amount),
  };
};

/**
 * Convert itau extrato csv content into ynab transactions
 * @param content Example: 16/09/2024;PIX TRANSF IMOBILI06/09;1421,63
 * @param accountId Example: 2d879295-30b5-4450-aabb-17fa1b64b202
 * @returns Example: {accountId, 2024-09-16, PIX TRANSF IMOBILI06/09, 1421630}
 */
export const convertItauExtratoToYnabTxs = ({
  content,
  accountId,
}: {
  content: string;
  accountId?: string;
}): YnabTx[] => {
  const rows = splitRows(content);
  const ynabTxs: YnabTx[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    try {
      const ynabTx = convertItauRowToYnabTx({ row, accountId });
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
