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
  { regex: /maria quit[é|e]ria/i, value: MARIA_QUITERIA },
  { regex: /copacabana 542.*605/i, value: COPA_542 },
  { regex: /americas 7907.*215/i, value: OPEN_MALL },
  { regex: /uni[ã|a]o.*ind[ú|u]stria.*9153.*201/i, value: GRANJA_BRASIL },
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
    /compet[ê|e]ncia.*pagamento(?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{4})/i;
  const row = rows.find((row) => regex.test(row));
  const matchGroups = row?.match(regex).groups;

  if (!matchGroups.day || !matchGroups.month || !matchGroups.year) {
    throw new Error("Could not find dataPagamento");
  }

  return `${matchGroups.day}/${matchGroups.month}/${matchGroups.year}`;
};

const getMesCompetencia = (rows: string[]) => {
  const regex = /compet[ê|e]ncia(?<month>\d{2})\/(?<year>\d{4})/i;
  const row = rows.find((row) => regex.test(row));
  const matchGroups = row?.match(regex).groups;

  if (!matchGroups.month || !matchGroups.year) {
    throw new Error("Could not find mesCompetencia");
  }

  return `${matchGroups.month}/${matchGroups.year}`;
};

const getValorAluguel = (rows: string[]) => {
  const regex = /Aluguel\s*(.+?(\d{2}\/\d{2}\/\d{4}))*(?<amount>[-\d\.,]+)/;
  const row = rows.find((row) => regex.test(row));
  const amount = row?.match(regex).groups.amount;

  if (!amount) {
    throw new Error("Could not find valorAluguel");
  }

  return Math.abs(parseAmountBR(amount));
};

const getTaxaAdministracao = (rows: string[]) => {
  const regex = /taxa.*administra[ç|c][ã|a]o\s*(?<amount>[-\d\.,]+)/i;
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

export const processArpoadorReport = (content: string): AluguelReportEntry => {
  const rows = splitRows(content);
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
