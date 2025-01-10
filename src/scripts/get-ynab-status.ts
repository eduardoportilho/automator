#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/get-ynab-status.ts
// $ ./src/scripts/get-ynab-status.ts $BUDGET_EDU_2025 $YNAB_ACCESS_TOKEN
import { osxCopy } from "../utils/clipboard/clipboard";
import { getEnvVars } from "../utils/scripts";
import { format, parseISO } from "date-fns";

import { fetchYnabBudget } from "../services/fetch-ynab-txs/fetch-ynab-txs";
import { formatYnabAmountBR } from "../utils/currency/currency";
import { DMY_FORMAT } from "../utils/date/date";
import { sortByFieldIndex } from "../utils/array/array";

const COL_SEPARATOR = "\t";
const ROW_SEPARATOR = "\n";
const EXCLUDE_CAT_GROUPS = [
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

(async () => {
  try {
    // Lendo das envs pq quero executar esse script pelo KM via `src/keyboard-maestro/run_automator_script.sh`
    // TODO: Seria legal parametrizar, por exemplo:
    // - especificar no KM os nomes das variaveis cujo valor sera passado como arg do script
    // - mudar `run_automator_script.sh` para ler esses nomes, pegar os valore em `env` e passa-los como arg para o script
    // Dessa forma esse script fica genérico, podendo ler budgetId e accessToken com getArgs ao invés de getEnvVars
    const [budgetId, accessToken] = getEnvVars([
      "BUDGET_EDU_2025",
      "YNAB_ACCESS_TOKEN",
    ]);

    // const [budgetId, accessToken] = getArgs({
    //   requiredCount: 2,
    //   errorMessage: `Missing arguments. Usage: get-ynab-status <budget-id> <access-token>`,
    // });

    let { categoryGroups, lastModifiedOn, accounts } = await fetchYnabBudget({
      budgetId,
      accessToken,
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
      ["Category group", `Activity on ${date}`],
      ...categoryGroups.map((group) => [
        group.name,
        formatYnabAmountBR(group.activity),
      ]),
      ["Account", `Balance on ${date}`],
      ...accounts.map((acc) => [acc.name, formatYnabAmountBR(acc.balance)]),
    ]
      .map((cols) => cols.join(COL_SEPARATOR))
      .join(ROW_SEPARATOR);

    console.log(`>>> YNAB status:`, statusReport);

    osxCopy(statusReport);

    console.log(`Done! The results were copied to the clipboard.`);
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
