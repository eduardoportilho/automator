import { YnabTx } from "../../types";
import { TxProcessor } from "../process-txs/process-txs";

const ignoreSaldo: TxProcessor = (tx: YnabTx) => {
  if (tx.payee_name.trim().toUpperCase() === "SALDO DISPONIVEL") {
    return null;
  }
  return tx;
};

export const EXTRATO_SAFRA_PROCESSORS = [ignoreSaldo];
