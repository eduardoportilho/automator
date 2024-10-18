import { format } from "date-fns";
import { YnabBudget, SheetContent } from "../../../../types";
import { findSectionByHeader } from "../../../../utils/sheet-search/sheet-search";
import { YNAB_DATE_FORMAT } from "../../../../utils/date/date";
import { getGroupActivity } from "../get-budget-activity/get-budget-activity";
import { convertYnabToAmount } from "../../../../utils/currency/currency";

const ROW_HEADERS = {
  RENDA_TOTAL: "Renda total",
  RENDA_PASSIVA: "Renda Passiva",
  RENDA_ATIVA: "Renda Ativa",
  GASTO_TOTAL: "Gasto total",
  RECORRENTES: "Recorrentes",
  SUPERFLUOS: "Superfluos",
  NAO_MENSAIS: "Não-mensais",
  OUTROS: "Outros",
  DELTA: "Delta",
  LIQUIDEZ_YNAB: "Liquidez YNAB",
};

const ITAU_CDB_DI = "Itaú: CDB-DI";

// TODO: add unit tests
export const createReportSection = ({
  sheetContent,
  budget,
}: {
  sheetContent: SheetContent;
  budget: YnabBudget;
}) => {
  const processingDate = format(new Date(), YNAB_DATE_FORMAT);

  const rendaPassiva = getGroupActivity({ budget, groupName: "Renda Passiva" });
  const rendaAtiva = getGroupActivity({ budget, groupName: "Renda Ativa" });
  const recorrentes = getGroupActivity({ budget, groupName: "Recorrentes" });
  const superfluos = getGroupActivity({ budget, groupName: "Superfluos" });
  const naoMensais = getGroupActivity({ budget, groupName: "Não-mensais" });
  const outros = getGroupActivity({ budget, groupName: "Outros" });
  const gastoTotal = recorrentes + superfluos + naoMensais + outros;
  const rendaTotal = rendaPassiva + rendaAtiva;
  const delta = rendaTotal - gastoTotal;
  const liquidezYnab = convertYnabToAmount(
    (budget.accounts ?? [])
      .filter(({ name }) => name !== ITAU_CDB_DI) // Exclude 'Itaú: CDB-DI' since it is an investiment account
      .reduce((sum, account) => {
        return sum + account.balance;
      }, 0)
  );

  const reportValues = {
    [ROW_HEADERS.RENDA_TOTAL]: [rendaTotal],
    [ROW_HEADERS.RENDA_PASSIVA]: [rendaPassiva],
    [ROW_HEADERS.RENDA_ATIVA]: [rendaAtiva],
    [ROW_HEADERS.GASTO_TOTAL]: [gastoTotal],
    [ROW_HEADERS.RECORRENTES]: [recorrentes],
    [ROW_HEADERS.SUPERFLUOS]: [superfluos],
    [ROW_HEADERS.NAO_MENSAIS]: [naoMensais],
    [ROW_HEADERS.OUTROS]: [outros],
    [ROW_HEADERS.DELTA]: [delta],
    [ROW_HEADERS.LIQUIDEZ_YNAB]: [liquidezYnab],
  };

  const reportRowHeaders = findSectionByHeader({
    rows: sheetContent,
    headerValue: "Report",
  }).map((row) => row[0]);

  return [
    [processingDate],
    ...reportRowHeaders.map((rowHeader) => reportValues[rowHeader] ?? []),
  ];
};
