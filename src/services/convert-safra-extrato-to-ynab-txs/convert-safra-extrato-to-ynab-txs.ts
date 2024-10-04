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
import { splitRows } from "../../utils/rows";

const convertSafraRowToYnabTx = ({
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
  if (cols.length < 4) {
    return null;
  }

  const [dateDMY, _, description, amountBR] = cols;
  const validDate = parseDateStringIfValid({
    value: dateDMY,
    dateFormat: DMY_FORMAT,
  });
  if (!validDate) {
    return null;
  }

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
    amount: convertAmountToYnab({ amount }),
    flag_color: "purple",
  };
};

/**
 * Convert safra extrato csv content into ynab transactions
 * @param content Example:
 *  Data;Tipo;Descrição;Valor
 *  02/09/2024;Saída;PIX ENVIADO;-6.300,00
 * @param accountId Example: 2d879295-30b5-4450-aabb-17fa1b64b202
 * @returns Example: {accountId, 2024-09-16, PIX TRANSF IMOBILI06/09, 1421630}
 */
export const convertSafraExtratoToYnabTxs = ({
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
      const ynabTx = convertSafraRowToYnabTx({ row, accountId });
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
