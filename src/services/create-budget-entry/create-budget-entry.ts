import { format } from "date-fns";
import { YnabBudget, SheetContent, YnabAccount } from "../../types";
import { NEXT_DATE_ANCHOR } from "../../constants";
import { findSectionByHeader } from "../../utils/sheet-search/sheet-search";
import { YNAB_DATE_FORMAT } from "../../utils/date/date";

const getBudgetCategoryActivity = ({
  budget,
  categoryGroupName,
  categoryName,
}: {
  budget: YnabBudget;
  categoryGroupName: string;
  categoryName: string;
}) => {
  const group = budget.categoryGroups.find(
    ({ name }) => name === categoryGroupName
  );
  if (!group) {
    return "";
  }
  const category = group.categories.find(({ name }) => name === categoryName);

  return category?.activity ?? "";
};

export const createBudgetEntry = ({
  sheetContent,
  budget,
  accounts,
}: {
  sheetContent: SheetContent;
  budget: YnabBudget;
  accounts: YnabAccount[];
}) => {
  const processingDate = format(new Date(), YNAB_DATE_FORMAT);
  const categories = findSectionByHeader({
    rows: sheetContent,
    headerValue: "Budget Category",
  }).map((row) => {
    const [categoryGroupName, categoryName] = row[0].toString().split(": ");
    return { categoryGroupName, categoryName };
  });

  const accountNames = findSectionByHeader({
    rows: sheetContent,
    headerValue: "Account",
  }).map((row) => row[0]);

  return [
    [processingDate, NEXT_DATE_ANCHOR],
    [],
    [budget.month],
    ...categories.map(({ categoryGroupName, categoryName }) => [
      getBudgetCategoryActivity({
        budget,
        categoryGroupName,
        categoryName,
      }),
    ]),
    [],
    [processingDate],
    ...accountNames.map((accountName) => {
      const account = accounts.find(({ name }) => name === accountName);

      if (account) {
        return [account.balance];
      }
      return [];
    }),
  ];
};

const EXAMPLE = [
  ["", "<next-date>"],

  ["Outros: Investimentos"],
  ["Não-mensais: Despesas anuais"],
  ["Não-mensais: Reformas e Manutenção"],
  ["Não-mensais: Médicos"],
  ["Recorrentes: Pedágio"],
  ["Recorrentes: Farmácia"],
  ["Recorrentes: Assinaturas mensais"],
  ["Recorrentes: Comida"],
  ["Recorrentes: Treino e terapias"],
  ["Superfluos: Compras"],
  ["Superfluos: Lazer"],
  ["Superfluos: Tiro"],
  ["Superfluos: Viagens"],
  ["Renda Passiva: Dividendos Ações"],
  ["Renda Passiva: Rendimento renda fixa"],
  ["Renda Passiva: Dividendos FIIs"],
  ["Renda Passiva: Despesas Aptos"],
  ["Renda Passiva: Rendimento Banco"],
  ["Renda Passiva: Alugueis"],
  ["Renda Passiva: Airbnb"],
];
