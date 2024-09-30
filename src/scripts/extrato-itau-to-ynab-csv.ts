#!/usr/bin/env ts-node

// Usage:
// chmod +x ./src/scripts/extrato-itau-to-ynab-csv.ts
// ./src/scripts/extrato-itau-to-ynab-csv.ts '/Users/eduardoportilho/Downloads/Extrato Conta Corrente-250920242201.txt'

import { convertItauExtratoToYnabTxs } from "../services/convert-itau-extrato-to-ynab-tx/convert-itau-extrato-to-ynab-tx";
import { createYnabCsvContent } from "../services/create-ynab-csv/create-ynab-csv";
import { readFile } from "../utils/file";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(
    "Missing argument. Usage: extrato-itau-to-ynab-csv.ts <path/to/extrato.txt> ?<path/to/output.csv>?"
  );
}

const [pathExtrato, pathOutput] = args;
const contentExtrato = readFile(pathExtrato);
const ynabTxs = convertItauExtratoToYnabTxs({ content: contentExtrato });
const ynabCsvContent = createYnabCsvContent(ynabTxs);

console.log(`Result:\n`);
console.log(ynabCsvContent);

//TODO: if(pathOutput) writeFile(pathOutput, ynabCsvContent)
