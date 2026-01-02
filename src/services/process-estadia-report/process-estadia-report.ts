/**
 * Versão 2026
 */
import { AluguelReportEntry } from "../../types";
import { GTC, LEBLON } from "../../constants";
import { splitRows } from "../../utils/rows";
import { parseAmountBR, roundCurrency } from "../../utils/currency/currency";
import {
  convertDateFormat,
  convertMmmBrToEn,
  diffInDays,
  DMY_FORMAT,
} from "../../utils/date/date";

const calculateDiariaLiquida = ({
  numeroDiarias,
  valorRepasse,
}: {
  numeroDiarias?: number;
  valorRepasse: number; // 13.403,05
}) => {
  if (!numeroDiarias) {
    return undefined;
  }

  return roundCurrency(valorRepasse / numeroDiarias);
};

export const isEstadiaReport = (content: string) => {
  return /Estadia Carioca/.test(content);
};

const getTextoLinhaSeguinte = (rows: string[], regexLinhaAnterior: RegExp) => {
  const indiceLinhaAnterior = rows.findIndex((row) =>
    regexLinhaAnterior.test(row)
  );

  if (indiceLinhaAnterior < 0 || indiceLinhaAnterior + 1 >= rows.length) {
    return "";
  }
  return rows[indiceLinhaAnterior + 1].trim();
};

const getValorAluguel = (rows: string[]) => {
  const linhaSeguinte = getTextoLinhaSeguinte(rows, /^Aluguel$/);

  return Math.abs(parseAmountBR(linhaSeguinte));
};

const getTaxaAdministracao = (rows: string[]) => {
  const linhaSeguinte = getTextoLinhaSeguinte(rows, /^Estadia$/);

  return Math.abs(parseAmountBR(linhaSeguinte));
};

const getValorRepasse = (rows: string[]) => {
  const linhaSeguinte = getTextoLinhaSeguinte(rows, /Saldo$/);

  const lastAmountIndex = linhaSeguinte.lastIndexOf("R$");
  if (lastAmountIndex < 0) {
    return 0;
  }

  return Math.abs(parseAmountBR(linhaSeguinte.substring(lastAmountIndex)));
};

const getNumeroDiarias = (rows: string[]) => {
  const dateRegex = /\d{1,2} \w{3} \d{4}/i;
  // 05 nov 2025 - 12 nov 2025 - 7 Nights
  // 05 dez 2025 - 09 dez 2025 - 4 Noite(s)
  const datasRowRegex = new RegExp(
    `(?<dtIn>${dateRegex.source}) - (?<dtOut>${dateRegex.source}) - (?<noites>.+) [Night|Noite]`,
    // `(?<dtIn>${dateRegex.source}) - (?<dtOut>${dateRegex.source}) - (?<noites>\\d{1,2}) [Night|Noite]`,
    "i"
  );
  const datasRow = rows.find((row) => datasRowRegex.test(row));
  const datasGroups = datasRow.match(datasRowRegex)?.groups;
  const dataEntrada = convertDateFormat({
    date: convertMmmBrToEn(datasGroups.dtIn),
    inputFormat: "dd MMM yyyy",
    outputFormat: DMY_FORMAT,
  });
  const dataSaida = convertDateFormat({
    date: convertMmmBrToEn(datasGroups.dtOut),
    inputFormat: "dd MMM yyyy",
    outputFormat: DMY_FORMAT,
  });
  const numeroDiariasCalculado = diffInDays({
    earlierDate: dataEntrada,
    laterDate: dataSaida,
  });

  let numeroDiarias = numeroDiariasCalculado;

  try {
    const noites = parseInt(datasGroups.noites, 10);
    if (!isNaN(noites)) {
      numeroDiarias = noites;
    }
  } catch (e) {
    console.warn(
      `Warning: could not parse numeroDiarias from extracted value [${datasGroups.noites}]. Using calculated value ${numeroDiariasCalculado}.`
    );
  }
  return { numeroDiarias, dataSaida };
};

export const processEstadiaReport = (content: string): AluguelReportEntry => {
  const rows = splitRows(content);
  const { numeroDiarias, dataSaida } = getNumeroDiarias(rows);
  const valorRepasse = getValorRepasse(rows);

  const entry = {
    imovel: LEBLON,
    dataPagamento: dataSaida,
    mesCompetencia: "",
    valorIr: 0,
    valorAluguel: getValorAluguel(rows),
    taxaAdministracao: getTaxaAdministracao(rows),
    valorRepasse,
    numeroDiarias,
    diariaLiquida: calculateDiariaLiquida({
      numeroDiarias,
      valorRepasse,
    }),
  };

  return entry;
};
