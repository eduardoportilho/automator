import { YnabTx } from "../../types";
import {
  TxProcessor,
  ProcessorRule,
  processTx,
} from "../process-txs/process-txs";

// TODO: Add unit tests

const PAYEE_RULES: ProcessorRule[] = [
  {
    payeeNamePattern: /TRATTORIA QUINTA/gi,
    to: { payee_name: "Trattoria Quinta do Lago" },
  },
  {
    payeeNamePattern: /PAO DE ACUCAR/gi,
    to: { payee_name: "Supermercado Pão de Açucar" },
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

export const FATURA_XP_PROCESSORS = [processFaturaTxs];
