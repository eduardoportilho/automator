import axios from "axios";
import { YnabTx } from "../../types";

async function postYnabData({
  path,
  data,
  accessToken,
}: {
  path: string;
  data: any;
  accessToken: string;
}) {
  const url = "https://api.youneedabudget.com/v1" + path;
  const options = {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };
  //   axios.interceptors.request.use((request) => {
  //   console.log("Starting Request", JSON.stringify(request, null, 2));
  //   return request;
  // });

  // axios.interceptors.response.use((response) => {
  //   console.log("Response:", JSON.stringify(response.data, null, 2));
  //   return response;
  // });
  try {
    return await axios.post(url, data, options);
  } catch (error) {
    if (error.response?.data?.error) {
      console.error(
        "Response error:",
        JSON.stringify(error.response.data.error, null, 2)
      );
    }
    throw error;
  }
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
