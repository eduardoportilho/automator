import axios from "axios";
import { parse, isWithinInterval } from "date-fns";
import { YnabTx } from "../../types";
import { YNAB_DATE_FORMAT } from "../../utils/date/date";

export const getYnabData = (path: string, accessToken: string) => {
  const url = "https://api.youneedabudget.com/v1" + path;
  const options = {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };
  // axios.interceptors.request.use((request) => {
  //   console.log("Starting Request", JSON.stringify(request, null, 2));
  //   return request;
  // });

  // axios.interceptors.response.use((response) => {
  //   console.log("Response:", JSON.stringify(response, null, 2));
  //   return response;
  // });
  try {
    return axios.get(url, options);
  } catch (error) {
    if (error.response?.data?.error) {
      console.error(
        "Response error:",
        JSON.stringify(error.response.data.error, null, 2)
      );
    }
    throw error;
  }
};

export const fetchYnabTxs = async ({
  budgetId,
  accountId,
  accessToken,
  from,
  to,
}: {
  budgetId: string;
  accountId: string;
  accessToken: string;
  from: Date;
  to: Date;
}) => {
  const accountTxsUrl = `/budgets/${budgetId}/accounts/${accountId}/transactions`;

  const response = await getYnabData(accountTxsUrl, accessToken);
  const allTxs = response.data.data.transactions as YnabTx[];
  return allTxs.filter((ynabTx) => {
    const date = parse(ynabTx.date, YNAB_DATE_FORMAT, new Date());
    return isWithinInterval(date, { start: from, end: to });
  });
};
