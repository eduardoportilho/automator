import {
  YnabBudget,
  YnabBudgetCategoryGroup,
  YnabBudgetResponse,
} from "../../types";

export const createYnabBudgetFromResponse = (
  response: YnabBudgetResponse // like src/sample-data/budget.ts
): YnabBudget => {
  const categoryGroupMap = response.category_groups
    .filter(({ hidden, deleted }) => !hidden && !deleted)
    .reduce((map, { id, name }) => {
      map[id] = {
        id,
        name,
        categories: [],
      };
      return map;
    }, {} as Record<string, YnabBudgetCategoryGroup>);

  response.categories
    .filter(({ hidden, deleted }) => !hidden && !deleted)
    .forEach((cat) => {
      categoryGroupMap[cat.category_group_id].categories.push({
        name: cat.name,
        budgeted: cat.budgeted,
        activity: cat.activity,
        balance: cat.balance,
      });
    });

  const accounts = response.accounts
    .filter(({ closed, deleted }) => !closed && !deleted)
    .map((acc) => ({
      id: acc.id,
      name: acc.name,
      balance: acc.balance,
    }));

  return {
    month: response.last_month.slice(0, 7), // "yyyy-MM-dd" → "yyyy-MM"
    categoryGroups: Object.values(categoryGroupMap),
    accounts: accounts,
  };
};
