import axios from "axios";
import { parse, isWithinInterval } from "date-fns";
import { YnabTx, YnabAccount, YnabBudget } from "../../types";
import { YNAB_DATE_FORMAT } from "../../utils/date/date";
import { createYnabBudgetFromResponse } from "../create-ynab-budget-from-response/create-ynab-budget-from-response";

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

// https://api.ynab.com/v1#/Transactions/getTransactionsByAccount
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
}): Promise<YnabTx[]> => {
  const accountTxsUrl = `/budgets/${budgetId}/accounts/${accountId}/transactions`;

  const response = await getYnabData(accountTxsUrl, accessToken);
  const allTxs = response.data.data.transactions as YnabTx[];
  return allTxs.filter((ynabTx) => {
    const date = parse(ynabTx.date, YNAB_DATE_FORMAT, new Date());
    return isWithinInterval(date, { start: from, end: to });
  });
};

// https://api.ynab.com/v1#/Accounts/getAccounts
export const fetchYnabAccounts = async ({
  budgetId,
  accessToken,
}: {
  budgetId: string;

  accessToken: string;
}): Promise<YnabAccount[]> => {
  const accountTxsUrl = `/budgets/${budgetId}/accounts`;

  const response = await getYnabData(accountTxsUrl, accessToken);

  return response.data.data.accounts.map(
    (account: { id: string; name: string; balance: number }) => ({
      id: account.id,
      name: account.name,
      balance: account.balance / 1000,
    })
  );
};

// https://api.ynab.com/v1#/Budgets/getBudgetById
export const fetchYnabBudget = async ({
  budgetId,
  accessToken,
}: {
  budgetId: string;
  accessToken: string;
}): Promise<any> => {
  // }): Promise<YnabBudget> => {
  const accountTxsUrl = `/budgets/${budgetId}`;

  const response = await getYnabData(accountTxsUrl, accessToken);

  return createYnabBudgetFromResponse(response.data.data.budget);
};
