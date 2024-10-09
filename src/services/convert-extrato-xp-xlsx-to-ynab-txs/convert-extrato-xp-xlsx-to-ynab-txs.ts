import { format } from "date-fns";
import { RowValue, SheetContent } from "../../types";
import { YnabTx } from "../../types";
import { convertAmountToYnab } from "../../utils/currency/currency";
import { isValidDateObject, YNAB_DATE_FORMAT } from "../../utils/date/date";

/**
 *
 * @param row Example:
 *  [Date(), Date(), "payee",588.77,3251.48]
 * @returns
 */
const convertExtratoXpRowToYnabTx = ({
  row,
  accountId,
}: {
  row: RowValue;
  accountId?: string;
}): YnabTx | null => {
  // [date, date liq., desc, value, saldo]
  if (row.length < 5) {
    return null;
  }

  const date = row[0];

  if (!isValidDateObject(date)) {
    return null;
  }

  const numericAmount = row[3];

  if (typeof numericAmount !== "number") {
    return null;
  }

  const description = row[2];

  if (typeof description !== "string") {
    return null;
  }

  const dateYnab = format(date, YNAB_DATE_FORMAT);

  return {
    account_id: accountId,
    date: dateYnab,
    payee_name: description,
    amount: convertAmountToYnab({ amount: numericAmount }),
    flag_color: "purple",
  };
};

/**
 * Convert extrato xp excel content into ynab transactions
 * @param content
 *  Header: Movimentação - Liquidação - Lançamento - Valor (R$) - Saldo (R$)
 *  Example row: ["2024-09-27T03:00:28.000Z","2024-09-27T03:00:28.000Z","JUROS S/ CAPITAL DE CLIENTES BBAS3 S/          3,712",588.77,3251.48]
 * @param accountId Example: 2d879295-30b5-4450-aabb-17fa1b64b202
 * @returns Example: {accountId, 2024-09-16, PIX TRANSF IMOBILI06/09, -1421630}
 */
export const convertExtratoXpXlsxToYnabTxs = ({
  excelContent,
  accountId,
}: {
  excelContent: SheetContent;
  accountId?: string;
}): YnabTx[] => {
  const ynabTxs: YnabTx[] = [];

  for (let index = 0; index < excelContent.length; index++) {
    const row = excelContent[index];
    try {
      const ynabTx = convertExtratoXpRowToYnabTx({ row, accountId });
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
