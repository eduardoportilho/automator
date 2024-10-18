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
    return 0;
  }
  const category = group.categories.find(({ name }) => name === categoryName);

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
