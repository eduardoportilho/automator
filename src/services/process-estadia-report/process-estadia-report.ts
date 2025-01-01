import { AluguelReportEntry } from "../../types";
import { GTC, LEBLON } from "../../constants";
import { splitRows } from "../../utils/rows";
import { parseAmountBR, roundCurrency } from "../../utils/currency/currency";
import {
  convertDateFormat,
  diffInDays,
  DMY_FORMAT,
} from "../../utils/date/date";

// dd-MM-yyyy
const DATE_REGEX = /(?<day>[0-3]\d)-(?<month>[0-1]\d)-(?<year>\d{4})/;

const getImovel = (rows: string[]) => {
  const regex = /(?<gtc>VIC406)|(?<leblon>Ata401)/i;
  const row = rows.find((row) => regex.test(row));
  const value = row?.match(regex).groups;

  if (!value.gtc && !value.leblon) {
    throw new Error("Could not find imovel");
  }

  return value.gtc ? GTC : LEBLON;
};

const getDataPagamentoMesCompetencia = (rows: string[]) => {
  const headerIndex = rows.findIndex((row) =>
    /Nº quitação.*Data.*Moeda/.test(row)
  );

  if (headerIndex <= 0) {
    throw new Error("Could not find dataPagamento");
  }

  // dangerous (?) assumption: data pagto is on the row below header
  // Nº quitaçãoDataMoeda
  // 580011-12-2024BRL
  const valorRepasseRow = rows[headerIndex + 1];
  const matchGroups = valorRepasseRow.match(DATE_REGEX).groups;

  if (!matchGroups.day || !matchGroups.month || !matchGroups.year) {
    throw new Error("Could not find dataPagamento");
  }

  return {
    dataPagamento: `${matchGroups.day}/${matchGroups.month}/${matchGroups.year}`,
    mesCompetencia: `${matchGroups.month}/${matchGroups.year}`,
  };
};

export const getPeriodoEstadia = (rows: string[]) => {
  const headerRowIndex = rows.findIndex((row) =>
    /Reserva.*Periodo de estadia/.test(row)
  );

  if (headerRowIndex < 0) {
    throw new Error("Could not find periodo estadia");
  }

  const footerRowIndex = rows.findIndex((row, index) => {
    return index > headerRowIndex && /^Subtotal:/.test(row);
  });

  if (footerRowIndex < 0) {
    throw new Error("Could not find periodo estadia");
  }

  const dateRegex = /[0-3]\d-[0-1]\d-\d{4}/;
  const periodEstadiaRegex = new RegExp(
    `(?<dataEntrada>${dateRegex.source}) - (?<dataSaida>${dateRegex.source})`
  );

  const estadiaRows = rows.slice(headerRowIndex + 1, footerRowIndex);

  const numeroDiarias = estadiaRows.reduce((acc, row) => {
    const matchGroups = row.match(periodEstadiaRegex).groups;

    if (!matchGroups.dataEntrada || !matchGroups.dataSaida) {
      console.log(`Could not find periodo estadia on row: [${row}]`);
      return acc;
    }

    const dataEntrada = convertDateFormat({
      date: matchGroups.dataEntrada,
      inputFormat: "dd-MM-yyyy",
      outputFormat: DMY_FORMAT,
    });
    const dataSaida = convertDateFormat({
      date: matchGroups.dataSaida,
      inputFormat: "dd-MM-yyyy",
      outputFormat: DMY_FORMAT,
    });

    return (
      acc +
      diffInDays({
        earlierDate: dataEntrada,
        laterDate: dataSaida,
      })
    );
  }, 0);

  return {
    numeroDiarias,
  };
};

export const getValorAluguelRepasseAdm = (rows: string[]) => {
  const subtotalRow = rows.find((row) => /^Subtotal:/.test(row));

  // Subtotal:  2.843,62  568,722.274,90
  const amountRegex = /(\d{1,3}\.)*\d{1,3},\d{2}/;
  const subTotalRowRegex = new RegExp(
    `(?<valorAluguel>${amountRegex.source})\\s*(?<comissao>${amountRegex.source})\\s*(?<valorRepasse>${amountRegex.source})`
  );

  const subTotalMatchGroups = subtotalRow.match(subTotalRowRegex)?.groups;

  // "TOTAL QUITAÇÃO:R$ 3.299,94"
  const quitacaoRow = rows.find((row) => /QUITAÇÃO:/i.test(row));
  const quitacaoRowRegex = new RegExp(`(?<quitacao>${amountRegex.source})$`);
  const quitacaoMatchGroups = quitacaoRow.match(quitacaoRowRegex)?.groups;

  const valorRepasse =
    quitacaoMatchGroups?.quitacao ?? subTotalMatchGroups?.valorRepasse;

  if (
    !subTotalMatchGroups?.valorAluguel ||
    !valorRepasse ||
    !subTotalMatchGroups?.comissao
  ) {
    throw new Error(
      "Could not find valorAluguel, taxaAdministracao or valorRepasse"
    );
  }

  return {
    valorAluguel: Math.abs(parseAmountBR(subTotalMatchGroups.valorAluguel)),
    taxaAdministracao: Math.abs(parseAmountBR(subTotalMatchGroups.comissao)),
    valorRepasse: Math.abs(parseAmountBR(valorRepasse)),
  };
};

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
  return /Estadia Carioca Negócios Imobiliários LTDA/.test(content);
};

export const processEstadiaReport = (content: string): AluguelReportEntry => {
  const rows = splitRows(content);

  const entry = {
    imovel: getImovel(rows),
    ...getDataPagamentoMesCompetencia(rows),
    ...getValorAluguelRepasseAdm(rows),
    ...getPeriodoEstadia(rows),
  };

  return {
    ...entry,
    diariaLiquida: calculateDiariaLiquida(entry),
  };
};
