import { YnabTx } from "../../types";

export type TxProcessor = (tx: YnabTx) => YnabTx;

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
