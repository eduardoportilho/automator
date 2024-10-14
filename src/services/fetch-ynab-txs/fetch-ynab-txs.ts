import axios from "axios";
import { parse, isWithinInterval } from "date-fns";
import { YnabTx, YnabAccount } from "../../types";
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

const ACCOUNT_EXAMPLE = {
  id: "4bfbe406-924a-443a-a2ac-205a0232abbf",
  name: "Itaú: C. Corrente",
  type: "checking",
  on_budget: true,
  closed: false,
  note: null as string | null,
  balance: 25187670,
  cleared_balance: 25187670,
  uncleared_balance: 0,
  transfer_payee_id: "dd5226d9-74af-4bd5-8411-d390dd14a652",
  direct_import_linked: false,
  direct_import_in_error: false,
  last_reconciled_at: "2024-10-13T13:49:44Z",
  debt_original_balance: null as number | null,
  debt_interest_rates: {},
  debt_minimum_payments: {},
  debt_escrow_amounts: {},
  deleted: false,
};
