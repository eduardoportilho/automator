import "dotenv/config";
import axios from "axios";
import { YnabTx } from "../../types";

// .env should have the following keys:
// - YNAB_ACCESS_TOKEN="key"

function postYnabData(path: string, data: any) {
  const url = "https://api.youneedabudget.com/v1/" + path;
  const options = {
    headers: {
      Authorization: "Bearer " + process.env.YNAB_ACCESS_TOKEN,
    },
  };
  return axios.post(url, data, options);
}

/**
 * https://api.youneedabudget.com/v1#/Transactions/createTransaction
 */
export const uploadTxs = ({
  budgetId,
  txs,
}: {
  budgetId: string;
  txs: YnabTx[];
}) => {
  if (txs.length === 0) return Promise.resolve();

  const txsUrl = `/budgets/${budgetId}/transactions`;
  return postYnabData(txsUrl, {
    transactions: txs,
  });
};
