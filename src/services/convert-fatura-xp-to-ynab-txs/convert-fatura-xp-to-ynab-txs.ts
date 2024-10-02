import { YnabTx } from "../../types";
import {
  parseAmountBR,
  convertAmountToYnab,
} from "../../utils/currency/currency";
import {
  convertDateFormat,
  DMY_FORMAT,
  DMY_REGEX,
  YNAB_DATE_FORMAT,
} from "../../utils/date/date";
import { splitRows } from "../../utils/rows";

const convertFaturaXpRowToYnabTx = ({
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
    throw new Error(
      `Not enough columns (expected min 4). Row content: "${row}"`
    );
  }
  const [dateDMY, description, , amountBR] = cols;
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
    amount: convertAmountToYnab({ amount, invert: true }),
    flag_color: "purple",
  };
};

/**
 * Convert fatura xp csv content into ynab transactions
 * @param content Example:
 *  Data;Estabelecimento;Portador;Valor;Parcela
 *  24/08/2024;CAMBIO SAFRA GIG;EDUARDO P PORTILHO;R$ 9.023,18;-
 * @param accountId Example: 2d879295-30b5-4450-aabb-17fa1b64b202
 * @returns Example: {accountId, 2024-09-16, PIX TRANSF IMOBILI06/09, -1421630}
 */
export const convertFaturaXpToYnabTxs = ({
  content,
  accountId,
}: {
  content: string;
  accountId?: string;
}): YnabTx[] => {
  const rows = splitRows(content).filter((row) => DMY_REGEX.test(row));
  const ynabTxs: YnabTx[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    try {
      const ynabTx = convertFaturaXpRowToYnabTx({ row, accountId });
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
