import { YnabTx } from "../../types";

// TODO: Add unit tests
// TODO: Log update transactions

export type TxProcessor = (tx: YnabTx) => YnabTx;

export interface ProcessorRule {
  payeeNamePattern: string | RegExp;
  to: Partial<YnabTx> | null;
}

export const processTx = ({
  tx,
  rule,
}: {
  tx: YnabTx | null;
  rule: ProcessorRule;
}): YnabTx => {
  if (!tx) {
    return null;
  }

  if (testPayeeName(tx.payee_name, rule.payeeNamePattern)) {
    if (rule.to === null) {
      return null;
    }
    return {
      ...tx,
      ...rule.to,
    };
  }
  return tx;
};

export const testPayeeName = (payee: string, pattern: string | RegExp) => {
  if (typeof pattern === "string") {
    return payee.toUpperCase().startsWith(pattern.toUpperCase());
  }

  return pattern.test(payee);
};

export const processTxs = ({
  txs,
  processors,
}: {
  txs: YnabTx[];
  processors: TxProcessor[];
}) => {
  return txs
    .map((tx) => {
      const processedTx = processors.reduce(
        (partialTx, processTx) => processTx(partialTx),
        tx
      );

      return processedTx;
    })
    .filter(Boolean);
};
