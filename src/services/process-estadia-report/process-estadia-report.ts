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

const getPeriodoEstadia = (rows: string[]) => {
  const headerRowIndex = rows.findIndex((row) =>
    /Reserva.*Periodo de estadia/.test(row)
  );

  if (headerRowIndex <= 0) {
    throw new Error("Could not find periodo estadia");
  }

  // dangerous (?) assumption: entry is on the row below header
  //  ReservaPeriodo de estadiaValor do aluguel*ComissãoPago ao proprietário
  //  Gabelle04-12-2024 - 11-12-20242843.62568.722274.90
  const entryRow = rows[headerRowIndex + 1];

  const dateRegex = /[0-3]\d-[0-1]\d-\d{4}/;
  const periodEstadiaRegex = new RegExp(
    `(?<dataEntrada>${dateRegex.source}) - (?<dataSaida>${dateRegex.source})`
  );
  const matchGroups = entryRow.match(periodEstadiaRegex).groups;

  if (!matchGroups.dataEntrada || !matchGroups.dataSaida) {
    throw new Error("Could not find periodo estadia");
  }

  return {
    dataEntrada: convertDateFormat({
      date: matchGroups.dataEntrada,
      inputFormat: "dd-MM-yyyy",
      outputFormat: DMY_FORMAT,
    }),
    dataSaida: convertDateFormat({
      date: matchGroups.dataSaida,
      inputFormat: "dd-MM-yyyy",
      outputFormat: DMY_FORMAT,
    }),
  };
};

const getValorAluguelRepasseAdm = (rows: string[]) => {
  const subtotalRow = rows.find((row) => /Subtotal:/.test(row));

  // Subtotal:  2.843,62  568,722.274,90
  const amountRegex = /(\d{1,3}\.)*\d{1,3},\d{2}/;
  const rowRegex = new RegExp(
    `(?<valorAluguel>${amountRegex.source})\\s*(?<comissao>${amountRegex.source})\\s*(?<valorRepasse>${amountRegex.source})`
  );

  const matchGroups = subtotalRow.match(rowRegex)?.groups;

  if (
    !matchGroups?.valorAluguel ||
    !matchGroups?.valorRepasse ||
    !matchGroups?.comissao
  ) {
    throw new Error(
      "Could not find valorAluguel, taxaAdministracao or valorRepasse"
    );
  }

  return {
    valorAluguel: Math.abs(parseAmountBR(matchGroups.valorAluguel)),
    taxaAdministracao: Math.abs(parseAmountBR(matchGroups.comissao)),
    valorRepasse: Math.abs(parseAmountBR(matchGroups.valorRepasse)),
  };
};

const calculateDiariaLiquida = ({
  dataEntrada,
  dataSaida,
  valorRepasse,
}: {
  dataEntrada?: string; // dd/MM/yyyy
  dataSaida?: string; // dd/MM/yyyy
  valorRepasse: number; // 13.403,05
}) => {
  if (!dataEntrada || !dataSaida) {
    return undefined;
  }

  const diarias = diffInDays({
    earlierDate: dataEntrada,
    laterDate: dataSaida,
  });

  return roundCurrency(valorRepasse / diarias);
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
