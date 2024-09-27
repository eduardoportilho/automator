#!/usr/bin/env ts-node

// Usage:
// chmod +x ./src/scripts/extrato-itau-to-ynab.ts
// ./src/scripts/extrato-itau-to-ynab.ts '/Users/eduardoportilho/Downloads/Extrato Conta Corrente-250920242201.txt'

import { convertItauExtratoToYnab } from "../convert/convert-itau-extrato-to-ynab";
import { readFile } from "../utils/file";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error(
    "Missing argument. Usage: extrato-itau-to-ynab.ts <path/to/extrato.txt> ?<path/to/output.csv>? "
  );
}

const [pathExtrato, pathOutput] = args;
const contentExtrato = readFile(pathExtrato);
const contentYnab = convertItauExtratoToYnab(contentExtrato);

console.log(`Result:\n`);
console.log(contentYnab);