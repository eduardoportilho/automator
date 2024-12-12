import { AluguelReportEntry } from "../../types";
import { MILLENIUM } from "../../constants";
import { splitRows } from "../../utils/rows";
import {
  MONTH_YEAR_PT_BR_REGEX,
  DMY_REGEX,
  MMYYYY_REGEX,
  MONTHS_PT_BR,
} from "../../utils/date/date";
import { parseAmountBR } from "../../utils/currency/currency";

const MILLENIUM_REGEX =
  /(?<imovel>Avenida das Am[é|e]ricas 7707 SL 222 BL 02)/i;
const AMOUNT_REGEX = /[-\d\.,]+/;

const getRowsBetween = ({
  rows,
  startRowRegExp,
  endRowRegExp,
}: {
  rows: string[];
  startRowRegExp: RegExp;
  endRowRegExp: RegExp;
}) => {
  const startIndex = rows.findIndex((row) => startRowRegExp.test(row));
  const endIndex = rows.findIndex(
    (row, index) => index > startIndex && endRowRegExp.test(row)
  );

  return rows.slice(startIndex, endIndex);
};

const getMesCompetencia = (rows: string[]) => {
  const section = getRowsBetween({
    rows,
    startRowRegExp: /MÊS DE REFERENCIA/i,
    endRowRegExp: /LANÇAMENTO/i,
  });

  const result = section
    .find((row) => MONTH_YEAR_PT_BR_REGEX.test(row))
    ?.match(MONTH_YEAR_PT_BR_REGEX);

  if (!result.groups.mes || !result.groups.ano) {
    throw new Error("Could not find mes referencia");
  }

  const month = result.groups.mes?.toLowerCase();
  const monthNum = MONTHS_PT_BR.indexOf(month) + 1;
  const year = result.groups.ano;

  return `${monthNum.toString().padStart(2, "0")}/${year}`;
};

const getDataPgto = (rows: string[]) => {
  const section = getRowsBetween({
    rows,
    startRowRegExp: /Conta corrente do proprietário/i,
    endRowRegExp: /TOTAL DESTE IMÓVEL/i,
  });

  const result = section.find((row) => DMY_REGEX.test(row))?.match(DMY_REGEX);

  if (!result?.length) {
    throw new Error("Could not find data pagamento");
  }

  return result[0];
};

const getValorAluguel = (rows: string[]) => {
  const section = getRowsBetween({
    rows,
    startRowRegExp: /^RECEBIMENTO$/i,
    endRowRegExp: /^PAGAMENTO$/i,
  });

  // 10/2024ALUGUEL
  const pgtoRowIndex = section.findIndex((row) =>
    new RegExp(MMYYYY_REGEX.source + "ALUGUEL", "i").test(row)
  );

  if (pgtoRowIndex <= 0) {
    throw new Error("Could not find valor aluguel");
  }

  // dangerous assumption: the value is on the row above of it's header, ex:
  //  1.771,17
  // 10/2024ALUGUEL
  const valorAluguelRow = section[pgtoRowIndex - 1];

  const result = valorAluguelRow.match(AMOUNT_REGEX);
  if (!result?.length) {
    throw new Error("Could not find valor aluguel");
  }

  const valorAluguel = result[0];

  return Math.abs(parseAmountBR(valorAluguel));
};

const getTaxaAdministracao = (rows: string[]) => {
  const section = getRowsBetween({
    rows,
    startRowRegExp: /^PAGAMENTO$/i,
    endRowRegExp: /^TOTAL DESTE IM[Ó|O]VEL$/i,
  });

  // 10/2024TX ADM
  const taxaAdmIndex = section.findIndex((row) =>
    new RegExp(MMYYYY_REGEX.source + "TX ADM", "i").test(row)
  );

  if (taxaAdmIndex <= 0) {
    throw new Error("Could not find valor aluguel");
  }

  // dangerous assumption: the value is on the row above of it's header, ex:
  //  141,69
  // 10/2024TX ADM
  const taxaAdministracaoRow = section[taxaAdmIndex - 1];

  const result = taxaAdministracaoRow.match(AMOUNT_REGEX);
  if (!result?.length) {
    throw new Error("Could not find valor aluguel");
  }

  const taxaAdministracao = result[0];

  return Math.abs(parseAmountBR(taxaAdministracao));
};

const getValorRepasse = (rows: string[]) => {
  const section = getRowsBetween({
    rows,
    startRowRegExp: /Conta corrente do proprietário/i,
    endRowRegExp: /TOTAL DESTE IMÓVEL/i,
  });

  // 10/2024REPASSE AO PROP
  const repasseAoPropIndex = section.findIndex((row) =>
    new RegExp(MMYYYY_REGEX.source + "REPASSE AO PROP", "i").test(row)
  );

  if (repasseAoPropIndex <= 0) {
    throw new Error("Could not find valor repasse");
  }

  // dangerous assumption: the value is on the row above of it's header, ex:
  //  1.743,31
  //  10/2024REPASSE AO PROP
  const valorRepasseRow = section[repasseAoPropIndex - 1];

  const result = valorRepasseRow.match(AMOUNT_REGEX);
  if (!result?.length) {
    throw new Error("Could not find valor repasse");
  }

  const valorRepasse = result[0];

  return Math.abs(parseAmountBR(valorRepasse));
};

export const isBlueChipReport = (content: string) => {
  return MILLENIUM_REGEX.test(content);
};

export const processBluechipReport = (content: string): AluguelReportEntry => {
  const isMillenium = isBlueChipReport(content);

  if (!isMillenium) {
    return null;
  }

  const rows = splitRows(content);

  return {
    imovel: MILLENIUM,
    mesCompetencia: getMesCompetencia(rows),
    dataPagamento: getDataPgto(rows),
    valorAluguel: getValorAluguel(rows),
    taxaAdministracao: getTaxaAdministracao(rows),
    valorRepasse: getValorRepasse(rows),
  };
};
