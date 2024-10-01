import { YnabTx } from "../../types";

const AMOUNT_ERROR = 0.01;

export const includesYnabTx = (ynabTxs: YnabTx[], searchTx: YnabTx) => {
  const index = ynabTxs.findIndex((tx) => compareYnabTxs(tx, searchTx));
  return index >= 0;
};

export const compareYnabTxs = (a: YnabTx, b: YnabTx) => {
  if (a.date !== b.date) {
    return false;
  }

  if (Math.abs(a.amount - b.amount) < AMOUNT_ERROR) {
    return false;
  }

  return a.payee_name === b.payee_name;
};
