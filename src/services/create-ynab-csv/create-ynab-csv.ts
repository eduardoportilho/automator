import { YnabTx } from "../../types";
import {
  convertDateFormat,
  MDY_FORMAT,
  YNAB_DATE_FORMAT,
} from "../../utils/date/date";
import { formatYnabAmountUS } from "../../utils/currency/currency";
import { joinRows } from "../../utils/rows";

const YNAB_HEADER = "Date,Payee,Memo,Amount";

// Example - Out:
// 06/22/2021,Payee 1,Memo,-100.00
// 06/22/2021,Payee 2,Memo,500.00
const createYNABRow = ({
  dateMDY,
  payee,
  memo = "",
  amount,
}: {
  dateMDY: string;
  payee: string;
  memo?: string;
  amount: string;
}) => `${dateMDY},${payee},${memo},${amount}`;

// Example:
// In: YnabTx
//  2024-09-16, PIX TRANSF IMOBILI06/09, 1421630
// Out:
//  Date,Payee,Memo,Amount
//  09/16/2024,PIX TRANSF IMOBILI06/09,,1421.63
const createYnabCsvRow = (tx: YnabTx): string => {
  const dateMDY = convertDateFormat({
    date: tx.date,
    inputFormat: YNAB_DATE_FORMAT,
    outputFormat: MDY_FORMAT,
  });
  const amountUS = formatYnabAmountUS(tx.amount);
  return createYNABRow({
    dateMDY,
    payee: tx.payee_name,
    amount: amountUS,
  });
};

// https://support.ynab.com/en_us/formatting-a-csv-file-an-overview-BJvczkuRq
export const createYnabCsvContent = (txs: YnabTx[]): string => {
  const ynabRows: string[] = [];

  for (let index = 0; index < txs.length; index++) {
    const tx = txs[index];
    try {
      const ynabRow = createYnabCsvRow(tx);
      ynabRows.push(ynabRow);
    } catch (error) {
      // What to do? abort? skip? log?
      console.log(error);
    }
  }
  return joinRows({ rows: ynabRows, header: YNAB_HEADER });
};
