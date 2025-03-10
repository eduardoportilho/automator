import { convertYnabToAmount } from "../../../../utils/currency/currency";
import { YnabBudget } from "../../../../types";

export const getCategoryActivity = ({
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
    console.log(
      `\n!!! Não encontrei o grupo [${categoryGroupName}] no YNAB (existe na planilha)!\n`
    );
    return 0;
  }
  const category = group.categories.find(({ name }) => name === categoryName);

  if (categoryName.toLowerCase() === "total") {
    return convertYnabToAmount(group.activity ?? 0);
  }

  if (!category) {
    console.log(
      `\n!!! Não encontrei a categoria [${categoryName}] do grupo [${categoryGroupName}] no YNAB (existe na planilha)!\n`
    );
  }

  return convertYnabToAmount(category?.activity ?? 0);
};

export const getGroupActivity = ({
  groupName,
  budget,
}: {
  groupName: string;
  budget: YnabBudget;
}) => {
  const group = budget.categoryGroups.find(({ name }) => name === groupName);
  if (!group) {
    return 0;
  }

  const activity = group.categories.reduce((sum, category) => {
    return sum + category.activity;
  }, 0);

  return convertYnabToAmount(activity);
};
