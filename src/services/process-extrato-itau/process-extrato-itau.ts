import { YnabTx } from "../../types";
import {
  TxProcessor,
  ProcessorRule,
  processTx,
} from "../process-txs/process-txs";

// TODO: Add unit tests

const PAYEE_RULES: ProcessorRule[] = [
  {
    payeeNamePattern: "PIX TRANSF ERICA B",
    to: { payee_name: "Erica Brotherhood", memo: "Biodança" },
  },
  {
    payeeNamePattern: "PIX QRS TELEFONICA",
    to: { payee_name: "Vivo internet", memo: "Internet GTC" },
  },
  {
    payeeNamePattern: "PIX QRS Claro",
    to: { payee_name: "Claro internet", memo: "Internet Leblon" },
  },
  {
    payeeNamePattern: "PIX TRANSF LUIZ ED",
    to: { payee_name: "Abodha", memo: "Eneagrupo" },
  },
  {
    payeeNamePattern: "SISPAG ARPOADOR ADM DE",
    to: {
      payee_name: "Arpoador Imob.",
      memo: "$ Maria Quiteria | Open Mall | Copa | Granja",
    },
  },
  {
    payeeNamePattern: "PIX TRANSF IMOBILI",
    to: { payee_name: "Estadia Carioca" },
  },
  {
    payeeNamePattern: "PIX TRANSF 5096011",
    to: { payee_name: "Jeff Training" },
  },
  {
    payeeNamePattern: /^SISPAG BLUE/,
    to: { payee_name: "Blue Chip Imob.", memo: "$ Millennium" },
  },
  {
    payeeNamePattern: "PIX QRS M4 PRODUTOS",
    to: { payee_name: "Recarga TIM" },
  },
  { payeeNamePattern: "SISPAG PIX TIM S A", to: { payee_name: "Recarga TIM" } },
  { payeeNamePattern: "PIX TRANSF CLUBE D", to: { payee_name: "CTP" } },
  {
    payeeNamePattern: "PIX TRANSF MARIA E",
    to: { payee_name: "Maria Elidia", memo: "Cozinheira" },
  },
  {
    payeeNamePattern: "REND PAGO APLIC AUT MAIS",
    to: { payee_name: "Rendimento conta corrente" },
  },
  {
    payeeNamePattern: "REND PAGO APLIC AUT APR",
    to: { payee_name: "Rendimento conta corrente" },
  },
  {
    payeeNamePattern: "TED 102.0001.EDUARDO",
    to: { payee_name: "Transfer - XP: C. Corrente" },
  },
  {
    payeeNamePattern: "INT PERSON INFI",
    to: { payee_name: "Transfer - Itaú: V. Infinite" },
  },
  {
    payeeNamePattern: "RESGATE CDB",
    to: { payee_name: "Transfer - Itaú: CDB-DI" },
  },
];

const sanitizePayee = (payee: string) => {
  return (payee ?? "")
    .replace(/^(PIX.+)(\d\d\/\d\d)$/, "$1")
    .replace(/\s+/, " ")
    .trim();
};

const processTxs: TxProcessor = (tx: YnabTx) => {
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

export const EXTRATO_ITAU_PROCESSORS = [processTxs];
