import {
  findRowContainingValue,
  findFirstEmptyRow,
} from "../../utils/sheet-search/sheet-search";
import { Acao, Carteira, Fundo } from "../../types";
import { splitCsv } from "../../utils/rows";
import {
  createAcao,
  createFundo,
} from "../../utils/carteira-factory/carteira-factory";

const rowToAcao = (row: string[]): Acao => {
  if (row.length < 5) {
    return null;
  }

  const [ativo, quantidade, cotacao, posicao] = row;

  return createAcao({ ativo, quantidade, cotacao, posicao });
};

const rowToFundo = (row: string[]): Fundo => {
  if (row.length < 5) {
    return null;
  }

  const [
    ativo,
    emissor,
    indexador,
    taxa,
    pctIndexador,
    dataAplicacao,
    vencimento,
    quantidade,
    valorAplicado,
    saldoBruto,
    irPrevisto,
    iofPrevisto,
    saldoLiquido,
    status,
    localNegociacao,
  ] = row;

  const nome = `${ativo} - ${emissor}`;

  return createFundo({
    nome,
    quantidade,
    valorLiquido: saldoLiquido,
  });
};

const findSectionByHeader = ({
  rows,
  headerValue,
}: {
  rows: string[][];
  headerValue: string;
}) => {
  const { index: headerIndex } = findRowContainingValue({
    value: headerValue,
    sheetContent: rows,
  });
  const { index: nextEmptyRowIndex } = findFirstEmptyRow({
    startingAt: headerIndex,
    sheetContent: rows,
  });
  const endIndex = nextEmptyRowIndex >= 0 ? nextEmptyRowIndex : undefined;

  return rows.slice(headerIndex + 1, endIndex);
};

/**
 * Convert safra carteira TSV content into carteira object
 * @param csvContent
 */
export const convertCarteiraSafraTsvTo = (csvContent: string): Carteira => {
  const rows = splitCsv({ content: csvContent, separator: "\t" });

  const rendaFixaData = findSectionByHeader({
    headerValue: "Indexador",
    rows,
  });
  const fiiData = findSectionByHeader({
    headerValue: "Cotação",
    rows,
  });

  return {
    fiis: fiiData.map(rowToAcao).filter(Boolean),
    acoes: [],
    rendaFixa: rendaFixaData.map(rowToFundo).filter(Boolean),
    fundos: [],
  };
};
