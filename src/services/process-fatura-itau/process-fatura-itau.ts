import { YnabTx } from "../../types";
import {
  TxProcessor,
  ProcessorRule,
  processTx,
} from "../process-txs/process-txs";

// TODO: Add unit tests

const PAYEE_RULES: ProcessorRule[] = [
  {
    payeeNamePattern: "Google Gsuite_portilho.",
    to: { payee_name: "Google portilho.com" },
  },
  {
    payeeNamePattern: "Conectcar *conectcar",
    to: { payee_name: "Recarga Conectcar", memo: "Pedágio" },
  },
];

const sanitizePayee = (payee: string) => {
  return (payee ?? "").replace(/\s+/, " ").trim();
};

const processFaturaTxs: TxProcessor = (tx: YnabTx) => {
  const payeeName = sanitizePayee(tx.payee_name);
  const sanitizedTx = {
    ...tx,
    payee_name: payeeName,
  };

  return PAYEE_RULES.reduce(
    (processedTx, rule) => processTx({ tx: processedTx, rule }),
    sanitizedTx
  );
};

export const FATURA_ITAU_PROCESSORS = [processFaturaTxs];
