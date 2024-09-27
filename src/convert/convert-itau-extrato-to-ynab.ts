import { convertAmountBRtoUS } from "../utils/currency/currency";
import { convertDateDMYtoMDY } from "../utils/date/date";
import { joinRows, splitRows } from "../utils/rows";

const YNAB_HEADER = "Date,Payee,Memo,Amount";

// Example:
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
// In:
//  06/09/2024;PIX TRANSF IMOBILI06/09;1421,63
// Out:
//  Date,Payee,Memo,Amount
//  09/06/2024,PIX TRANSF IMOBILI06/09,,1421.63
const convertRow = (row: string): string => {
  const cols = row.split(";");
  if (cols.length < 3) {
    throw new Error(`Not enough columns (expected 3): ${row}`);
  }
  const [dateDMY, description, amountBR] = cols;
  const dateMDY = convertDateDMYtoMDY(dateDMY);
  const amountUS = convertAmountBRtoUS(amountBR);
  return createYNABRow({
    dateMDY,
    payee: description,
    amount: amountUS,
  });
};

// https://support.ynab.com/en_us/formatting-a-csv-file-an-overview-BJvczkuRq
export const convertItauExtratoToYnab = (content: string): string => {
  const rows = splitRows(content);
  const ynabRows: string[] = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    try {
      const ynabRow = convertRow(row);
      ynabRows.push(ynabRow);
    } catch (error) {
      // What to do? abort? skip? log?
      console.log(error);
    }
  }
  return joinRows({ rows: ynabRows, header: YNAB_HEADER });
};
