#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/check-ynab-progress.ts
// $ ./src/scripts/check-ynab-progress.ts $BUDGET_EDU_2025 $YNAB_ACCESS_TOKEN $TELEGRAM_ARMINIO_BOT_API_TOKEN $TELEGRAM_EDUARDOPORTILHO_USER_ID
import { getArgs } from "../utils/scripts";
import { format, parseISO } from "date-fns";

import { fetchYnabBudget } from "../services/fetch-ynab-txs/fetch-ynab-txs";
import {
  convertYnabToAmount,
  formatYnabAmountBR,
} from "../utils/currency/currency";
import { DMY_FORMAT } from "../utils/date/date";
import { sortByFieldIndex } from "../utils/array/array";
import { sendMessage } from "../services/api/telegram/telegram";
import { YnabAccount, YnabBudgetCategoryGroup } from "../types";

const ROW_SEPARATOR = "\n";
const EXCLUDE_CAT_GROUPS = [
  "Renda Ativa",
  "Renda Passiva",
  "Internal Master Category",
  "Credit Card Payments",
  "Hidden Categories",
];
const SORTED_ACCOUNT_NAMES = [
  "Itaú: C. Corrente",
  "Itaú: V. Infinite",
  "Itaú: Master Black",
  "Itaú: CDB-DI",
  "Safra: C. Corrente",
  "XP: C. Corrente",
  "XP: V. Infinite",
];

const DANGER_GROUP_BALANCE = 500.0;

const buildAccountReportRow = ({ name, balance }: YnabAccount): string => {
  return `- ${name}: R$${formatYnabAmountBR(balance)}`;
};

const buildGroupReportRow = ({
  name,
  budgeted,
  balance,
}: YnabBudgetCategoryGroup): string => {
  const balanceAmount = convertYnabToAmount(balance);

  const icon =
    balanceAmount < 0
      ? "📛"
      : balanceAmount < DANGER_GROUP_BALANCE
      ? "⚠️"
      : "💚";

  return `${icon} ${name}: R$${formatYnabAmountBR(
    balance
  )}\n- \`Budget: R$${formatYnabAmountBR(budgeted)}\``;
};

(async () => {
  try {
    const [budgetId, ynabAccessToken, telegramToken, eppTelegramUser] = getArgs(
      {
        requiredCount: 2,
        errorMessage: `Missing arguments. Usage: check-ynab-progress <budget-id> <access-token> <telegram-token> <telegram-user-id>`,
      }
    );

    let { categoryGroups, lastModifiedOn, accounts } = await fetchYnabBudget({
      budgetId,
      accessToken: ynabAccessToken,
    });
    // Remove groups that doesn't matter
    categoryGroups = categoryGroups.filter(
      ({ name }) => !EXCLUDE_CAT_GROUPS.includes(name)
    );
    // Sort as we use it
    accounts = sortByFieldIndex({
      array: accounts,
      sortedFieldValues: SORTED_ACCOUNT_NAMES,
      key: "name",
    });

    const date = format(parseISO(lastModifiedOn), DMY_FORMAT);

    const statusReport = [
      "*Category groups balance:*",
      ...categoryGroups.map((group) => buildGroupReportRow(group)),
      "",
      "*Account balance:*",
      ...accounts.map((acc) => buildAccountReportRow(acc)),
    ].join(ROW_SEPARATOR);

    console.log(`>>> YNAB status:`, statusReport);

    sendMessage({
      token: telegramToken,
      chatId: eppTelegramUser,
      text: statusReport,
    });

    console.log(`Done! The report was sent to telegram.`);
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
