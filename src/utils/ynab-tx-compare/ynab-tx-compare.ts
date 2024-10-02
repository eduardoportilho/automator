import { YnabTx } from "../../types";

export const includesYnabTx = (ynabTxs: YnabTx[], searchTx: YnabTx) => {
  const index = ynabTxs.findIndex((tx) => compareYnabTxs(tx, searchTx));
  return index >= 0;
};

export const compareYnabTxs = (a: YnabTx, b: YnabTx) => {
  if (a.date !== b.date) {
    return false;
  }

  if (Math.abs(a.amount - b.amount) > 0) {
    return false;
  }

  return (
    a.payee_name.toLowerCase().trim() === b.payee_name.toLowerCase().trim()
  );
};
