import { YnabTx } from "../../types";
import { TxProcessor } from "../process-txs/process-txs";

// TODO: Add unit tests
// TODO: Move utils
// TODO: Log update transactions
interface Rule {
  from: string | RegExp;
  to: Partial<YnabTx>;
}

const PAYEE_RULES: Rule[] = [
  {
    from: "PIX TRANSF ERICA B",
    to: { payee_name: "Erica Brotherhood", memo: "Biodança" },
  },
  {
    from: "PIX QRS TELEFONICA",
    to: { payee_name: "Vivo internet", memo: "Internet GTC" },
  },
  {
    from: "PIX QRS Claro",
    to: { payee_name: "Claro internet", memo: "Internet Leblon" },
  },
  {
    from: "PIX TRANSF LUIZ ED",
    to: { payee_name: "Abodha", memo: "Eneagrupo" },
  },
  {
    from: "SISPAG ARPOADOR ADM DE",
    to: {
      payee_name: "Arpoador Imob.",
      memo: "$ Maria Quiteria | Open Mall | Copa | Granja",
    },
  },
  { from: "PIX TRANSF IMOBILI", to: { payee_name: "Estadia Carioca" } },
  { from: "PIX TRANSF 5096011", to: { payee_name: "Jeff Training" } },
  {
    from: /^SISPAG BLUE/,
    to: { payee_name: "Blue Chip Imob.", memo: "$ Millennium" },
  },
  { from: "PIX QRS M4 PRODUTOS", to: { payee_name: "Recarga TIM" } },
  { from: "SISPAG PIX TIM S A", to: { payee_name: "Recarga TIM" } },
  { from: "PIX TRANSF CLUBE D", to: { payee_name: "CTP" } },
  {
    from: "PIX TRANSF MARIA E",
    to: { payee_name: "Maria Elidia", memo: "Cozinheira" },
  },
  {
    from: "REND PAGO APLIC AUT MAIS",
    to: { payee_name: "Rendimento conta corrente" },
  },
  {
    from: "TED 102.0001.EDUARDO",
    to: { payee_name: "Transfer - XP: C. Corrente" },
  },
  {
    from: "INT PERSON INFI",
    to: { payee_name: "Transfer - Itaú: V. Infinite" },
  },
  {
    from: "RESGATE CDB",
    to: { payee_name: "Transfer - Itaú: CDB-DI" },
  },
];

const sanitizePayee = (payee: string) => {
  return (payee ?? "")
    .replace(/^(PIX.+)(\d\d\/\d\d)$/, "$1")
    .replace(/\s+/, " ")
    .trim();
};

const testPayee = (payee: string, pattern: string | RegExp) => {
  if (typeof pattern === "string") {
    return payee.toUpperCase().startsWith(pattern.toUpperCase());
  }

  return pattern.test(payee);
};

const processTx = ({ tx, rule }: { tx: YnabTx; rule: Rule }): YnabTx => {
  if (testPayee(tx.payee_name, rule.from)) {
    return {
      ...tx,
      ...rule.to,
    };
  }
  return tx;
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
