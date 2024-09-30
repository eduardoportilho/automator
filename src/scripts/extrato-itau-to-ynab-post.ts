#!/usr/bin/env ts-node

// Usage:
// $ chmod +x ./src/scripts/extrato-itau-to-ynab-post.ts
// $ ./src/scripts/extrato-itau-to-ynab-post.ts '/Users/eduardoportilho/Downloads/Extrato Conta Corrente-250920242201.txt' $BUDGET_EDU $ITAU_EDU
// $ ./src/scripts/extrato-itau-to-ynab-post.ts '/Users/eduardoportilho/Downloads/casal-240930.txt' $BUDGET_CASAL $ITAU_CASAL

import { uploadTxs } from "../services/ynab/ynab";
import { convertItauExtratoToYnabTxs } from "../services/convert-itau-extrato-to-ynab-tx/convert-itau-extrato-to-ynab-tx";
import { readFile } from "../utils/file";

const args = process.argv.slice(2);

if (args.length !== 3) {
  console.error(
    "Missing arguments. Usage: extrato-itau-to-ynab-post.ts <path/to/extrato.txt> <budget-id> <account-id>"
  );
  process.exit();
}
if (!process.env.YNAB_ACCESS_TOKEN) {
  console.error(
    "Missing envirnonment var: YNAB_ACCESS_TOKEN). Please add them to `.envrc`."
  );
  console.info("More info at `https://direnv.net/`:");
  console.info(`$ echo export YNAB_ACCESS_TOKEN=abc123 > .envrc`);
  console.info(`$ direnv allow .`);
  process.exit();
}

const [pathExtrato, budgetId, accountId] = args;
const contentExtrato = readFile(pathExtrato);
const ynabTxs = convertItauExtratoToYnabTxs({
  content: contentExtrato,
  accountId,
});

(async () => {
  console.log("Uploading ${ynabTxs.length} transactions...");
  await uploadTxs({ budgetId: budgetId, txs: ynabTxs });
  console.log("Done!");
})();
