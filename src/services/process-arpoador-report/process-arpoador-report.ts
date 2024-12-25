import { AluguelReportEntry } from "../../types";
import {
  MARIA_QUITERIA,
  COPA_542,
  OPEN_MALL,
  GRANJA_BRASIL,
} from "../../constants";
import { splitRows } from "../../utils/rows";
import { parseAmountBR } from "../../utils/currency/currency";

const IMOVEL_NAME_MAP = [
  { regex: /maria quit.ria/i, value: MARIA_QUITERIA },
  { regex: /copacabana 542.*605/i, value: COPA_542 },
  { regex: /americas 7907.*215/i, value: OPEN_MALL },
  { regex: /uni.o.*ind.stria.*9153.*201/i, value: GRANJA_BRASIL },
];

const getImovel = (rows: string[]) => {
  const regex = /^Contrato\s*(?<imovel>.+)/;
  const row = rows.find((row) => regex.test(row));
  const value = row?.match(regex).groups.imovel;

  if (!value) {
    throw new Error("Could not find imovel");
  }

  const mapper = IMOVEL_NAME_MAP.find((mapper) => mapper.regex.test(value));

  if (mapper) {
    return mapper.value;
  }
  return value;
};

const getDataPagamento = (rows: string[]) => {
  const regex =
    /compet.ncia.*pagamento\s*(?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{4})/i;
  const row = rows.find((row) => regex.test(row));
  const matchGroups = row?.match(regex).groups;

  if (!matchGroups.day || !matchGroups.month || !matchGroups.year) {
    throw new Error("Could not find dataPagamento");
  }

  return `${matchGroups.day}/${matchGroups.month}/${matchGroups.year}`;
};

const getMesCompetencia = (rows: string[]) => {
  const regex = /compet.ncia\s*(?<month>\d{2})\/(?<year>\d{4})/i;
  const row = rows.find((row) => regex.test(row));
  const matchGroups = row?.match(regex).groups;

  if (!matchGroups.month || !matchGroups.year) {
    throw new Error("Could not find mesCompetencia");
  }

  return `${matchGroups.month}/${matchGroups.year}`;
};

const getValorAluguel = (rows: string[]) => {
  const rowRegex = /Aluguel.*([\d\.,]+)$/;
  const row = rows.find((row) => rowRegex.test(row));

  // '/2024', optional space, amount
  const regexWithDate = /.+\/20\d{2}\s?(?<amount>[\d\.,]+)$/;

  // anything (lazy), amount
  // `.+?` : lazy, i.e. by adding the ? after the +, we tell it to repeat as few times as possible
  // @see https://stackoverflow.com/questions/2301285/what-do-lazy-and-greedy-mean-in-the-context-of-regular-expressions
  const regexWithoutDate = /.+?(?<amount>[\d\.,]+)$/;

  const dateRegex = /\d{2}\/\d{2}\/\d{4}/;

  let amount = "";
  if (dateRegex.test(row)) {
    amount = row?.match(regexWithDate).groups.amount;
  } else {
    amount = row?.match(regexWithoutDate).groups.amount;
  }

  if (!amount) {
    throw new Error("Could not find valorAluguel");
  }

  return Math.abs(parseAmountBR(amount));
};

const getTaxaAdministracao = (rows: string[]) => {
  const regex = /taxa.*administra..o\s*(?<amount>[-\d\.,]+)/i;
  const row = rows.find((row) => regex.test(row));
  const amount = row?.match(regex).groups.amount;

  if (!amount) {
    throw new Error("Could not find taxaAdministracao");
  }

  return Math.abs(parseAmountBR(amount));
};

const getValorIr = (rows: string[]) => {
  const regex = /^IR.*\)(?<amount>[-\d\.,]+)/i;
  const row = rows.find((row) => regex.test(row));
  const amount = row?.match(regex).groups.amount;

  if (!amount) {
    return undefined;
  }

  return Math.abs(parseAmountBR(amount));
};

const getValorRepasse = (rows: string[]) => {
  const regex = /^Total para repasse\s*(?<amount>[-\d\.,]+)/;
  const row = rows.find((row) => regex.test(row));
  const amount = row?.match(regex).groups.amount;

  if (!amount) {
    throw new Error("Could not find valorRepasse");
  }

  return Math.abs(parseAmountBR(amount));
};

export const removeHeader = (rows: string[]) => {
  const headerExtratoIndex = rows.findIndex((row) =>
    row.toLowerCase().startsWith("extrato")
  );

  if (headerExtratoIndex > 0) {
    return rows.slice(headerExtratoIndex + 1);
  }
  return rows;
};

export const processArpoadorReport = (content: string): AluguelReportEntry => {
  let rows = splitRows(content);
  rows = removeHeader(rows);

  return {
    imovel: getImovel(rows),
    dataPagamento: getDataPagamento(rows),
    mesCompetencia: getMesCompetencia(rows),
    valorAluguel: getValorAluguel(rows),
    taxaAdministracao: getTaxaAdministracao(rows),
    valorIr: getValorIr(rows),
    valorRepasse: getValorRepasse(rows),
  };
};
