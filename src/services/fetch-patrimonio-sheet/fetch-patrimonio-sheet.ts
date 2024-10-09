import {
  INVESTIMENTOS_SHEET_TITLE,
  INVESTIMENTOS_SPREADSHEET_ID,
} from "../../constants";
import { getSheetRanges } from "../../utils/sheets/sheets";

export const fetchPatrimonioSheet = async () => {
  //Read all columns from A to Z
  const [sheetContent] = await getSheetRanges(INVESTIMENTOS_SPREADSHEET_ID, [
    `${INVESTIMENTOS_SHEET_TITLE}!A:Z`,
  ]);

  return sheetContent;
};

const example = [
  ["", "", "2024-10-07", "", "", "", "<next-date>"],
  ["FIIs"],
  [],
  ["Ativo", "Banco", "Qtd", "Cotação", "Posição"],
  ["RZAG11", "XP"],
  ["CDII15", "XP"],
  ["CPTR11", "XP"],
  ["HGRU11", "Safra"],
  ["KNCR11", "Safra"],
  ["KNIP11", "Safra"],
  ["MALL11", "Safra"],
  ["MCCI11", "Safra"],
  ["RBRP11", "Safra"],
  ["RBRR11", "Safra"],
  ["RZTR11", "Safra"],
  ["URPR11", "Safra"],
  ["VRTA11", "Safra"],
  ["XPLG11", "Safra"],
  ["JSAF11", "Safra"],
  ["RZAT11", "Safra"],
  ["BRCYCRR08M10", "Safra"],
  [],
  [],
  ["Ações"],
  [],
  ["Ativo", "Banco", "Qtd", "Cotação", "Posição"],
  ["PETR4", "XP"],
  ["VALE3", "XP"],
  ["BBAS3", "XP"],
  ["PETR3", "XP"],
  ["RAIZ4", "XP"],
  ["EGIE3", "XP"],
  [],
  ["Renda Fixa"],
  [],
  ["Ativo", "Banco", "Qtd", "Preço Unitário", "Posição", "Valor líquido"],
  ["CDB FIBRA - ABR/2025", "XP"],
  ["CDB AGIBANK - ABR/2025", "XP"],
  ["CRA VALE DO TIJUCO - NOV/2025", "XP"],
  ["CRI FINAL PRO IPCA - MATEUS SUPERMERCADOS S/A", "Safra"],
  ["CRA Emissão Terceiros IPCA - BRF BRASIL FOODS S/A", "Safra"],
  ["CRA Emissão Terceiros IPCA - ACO VERDE DO BRASIL S/A", "Safra"],
  [],
  ["Fundos de Investimentos\t\t\t\t\t"],
  [],
  ["Ativo", "Banco", "Qtd", "Preço Unitário", "Posição", "Valor líquido"],
  ["Trend Pós-Fixado FIC FIRF Simples", "XP"],
  ["Trend Investback FIC FIRF Simples", "XP"],
  ["Giant Zarathustra Advisory FIC FIM", "XP"],
  ["Ibiuna Hedge ST Advisory FIC FIM", "XP"],
  ["Crescera Growth Capital V FIP Multi - Classe A", "XP"],
  ["Crescera Growth Classe A - XP Trend PE IV FIRF Simples", "XP"],
  ["MS Global Opportunities Dólar Advisory FIC FIA IE - Resp Limitada", "XP"],
  ["Trend Bolsa Chinesa FIA", "XP"],
];
