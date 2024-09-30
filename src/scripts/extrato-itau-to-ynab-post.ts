#!/usr/bin/env ts-node

// Usage:
// chmod +x ./src/scripts/extrato-itau-to-ynab-post.ts
// ./src/scripts/extrato-itau-to-ynab-post.ts '/Users/eduardoportilho/Downloads/Extrato Conta Corrente-250920242201.txt accountid'

import "dotenv/config";
import { uploadTxs } from "../services/ynab/ynab";
import { convertItauExtratoToYnabTxs } from "../services/convert-itau-extrato-to-ynab-tx/convert-itau-extrato-to-ynab-tx";
import { readFile } from "../utils/file";

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error(
    "Missing arguments. Usage: extrato-itau-to-ynab-post.ts <path/to/extrato.txt> <account-id>"
  );
}

const [pathExtrato, accountId] = args;
const contentExtrato = readFile(pathExtrato);
const ynabTxs = convertItauExtratoToYnabTxs({
  content: contentExtrato,
  accountId,
});

uploadTxs({ budgetId: process.env.BUDGET_ID, txs: ynabTxs });

console.log(`Done!`);
