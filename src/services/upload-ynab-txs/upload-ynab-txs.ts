import axios from "axios";
import { YnabTx } from "../../types";

// .env should have the following keys:
// - YNAB_ACCESS_TOKEN="key"

function postYnabData({
  path,
  data,
  accessToken,
}: {
  path: string;
  data: any;
  accessToken: string;
}) {
  const url = "https://api.youneedabudget.com/v1/" + path;
  const options = {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };
  return axios.post(url, data, options);
}

/**
 * https://api.youneedabudget.com/v1#/Transactions/createTransaction
 */
export const uploadYnabTxs = ({
  budgetId,
  txs,
  accessToken,
}: {
  budgetId: string;
  txs: YnabTx[];
  accessToken: string;
}) => {
  if (txs.length === 0) return Promise.resolve();

  const txsUrl = `/budgets/${budgetId}/transactions`;
  return postYnabData({
    path: txsUrl,
    data: {
      transactions: txs,
    },
    accessToken,
  });
};
