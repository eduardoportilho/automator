#!/usr/bin/env ts-node

// $ ts-node ./src/scripts/hello-world.ts
//  or
// $ chmod +x ./src/scripts/*.*
// $ ./src/scripts/hello-world.ts

import { getEnvVars } from "../utils/scripts";
import { fetchYnabAccounts } from "../services/fetch-ynab-txs/fetch-ynab-txs";

(async () => {
  try {
    console.log(`Hello world`);
    // console.log(process.env.YNAB_ACCESS_TOKEN);

    const [accessToken, budgetId] = getEnvVars([
      "YNAB_ACCESS_TOKEN",
      "BUDGET_EDU_2025",
    ]);

    const accounts = await fetchYnabAccounts({
      budgetId,
      accessToken,
    });

    console.log(accounts);
    console.log("Done!");
  } catch (error) {
    console.error("Error encountered, aborting.");
    console.error(error);
  }
})();
