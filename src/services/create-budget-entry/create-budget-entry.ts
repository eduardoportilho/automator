import { YnabBudget, SheetContent } from "../../types";
import { NEXT_DATE_ANCHOR } from "../../constants";

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
}: {
  sheetContent: SheetContent;
  budget: YnabBudget;
}) => {
  const categories = sheetContent
    .slice(1) // Remove month header
    .map((cell) => {
      const [categoryGroupName, categoryName] = cell.toString().split(": ");
      return { categoryGroupName, categoryName };
    });

  return [
    [budget.month, NEXT_DATE_ANCHOR],
    ...categories.map(({ categoryGroupName, categoryName }) => [
      getBudgetCategoryActivity({
        budget,
        categoryGroupName,
        categoryName,
      }),
    ]),
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
