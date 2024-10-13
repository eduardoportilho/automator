import { YnabTx } from "../../types";
import {
  TxProcessor,
  ProcessorRule,
  processTx,
} from "../process-txs/process-txs";

const PAYEE_RULES: ProcessorRule[] = [
  {
    payeeNamePattern: "SALDO DISPONIVEL",
    to: null,
  },
  {
    payeeNamePattern: "RENDIMENTO POUP",
    to: { payee_name: "Rendimento conta corrente" },
  },
  {
    payeeNamePattern: "RENDIMENTO SOBRE JUROS CAP PROPR BOVESP",
    to: { payee_name: "Dividendos FIIs" },
  },
  {
    payeeNamePattern: "PGTO JUR/AMORT",
    to: { payee_name: "Rendimento renda fixa" },
  },
];

const processTxs: TxProcessor = (tx: YnabTx) => {
  return PAYEE_RULES.reduce(
    (processedTx, rule) => processTx({ tx: processedTx, rule }),
    tx
  );
};

export const EXTRATO_SAFRA_PROCESSORS = [processTxs];
