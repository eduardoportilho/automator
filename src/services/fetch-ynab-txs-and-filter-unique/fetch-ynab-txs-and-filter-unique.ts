import { parse, min, max } from "date-fns";
import { YnabTx } from "../../types";
import { YNAB_DATE_FORMAT } from "../../utils/date/date";
import { fetchYnabTxs } from "../fetch-ynab-txs/fetch-ynab-txs";
import { includesYnabTx } from "../../utils/ynab-tx-compare/ynab-tx-compare";

const getTxsDateRange = (txs: YnabTx[]) => {
  const dates = txs.map((tx) => parse(tx.date, YNAB_DATE_FORMAT, new Date()));
  return { from: min(dates), to: max(dates) };
};

export const fetchYnabTxsAndFilterUnique = async ({
  budgetId,
  accountId,
  accessToken,
  originalTxs,
}: {
  budgetId: string;
  accountId: string;
  accessToken: string;
  originalTxs: YnabTx[];
}): Promise<{
  uniqueTxs: YnabTx[];
  duplicateTxs: YnabTx[];
}> => {
  const { from, to } = getTxsDateRange(originalTxs);
  const remoteTxs = await fetchYnabTxs({
    budgetId,
    accountId,
    accessToken,
    from,
    to,
  });

  const { uniqueTxs, duplicateTxs } = originalTxs.reduce(
    (acc, newTx) => {
      if (includesYnabTx(remoteTxs, newTx)) {
        acc.duplicateTxs.push(newTx);
      } else {
        acc.uniqueTxs.push(newTx);
      }

      return acc;
    },
    { uniqueTxs: [], duplicateTxs: [] }
  );

  return {
    uniqueTxs,
    duplicateTxs,
  };
};
