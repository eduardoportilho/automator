import {
  YnabBudget,
  YnabBudgetCategoryGroup,
  YnabBudgetResponse,
} from "../../types";

/**
 * Convert YnabBudgetResponse from API into YnabBudget type
 * @param response YnabBudgetResponse - like src/sample-data/budget.ts
 * @param month string | undefined - The month from which the budget category amounts (budgeted,activity,balance) will be read.
 *  - last_month will be used if this arg is undefined
 * @returns YnabBudget
 */
export const createYnabBudgetFromResponse = (
  response: YnabBudgetResponse, // like src/sample-data/budget.ts
  month?: string // "yyyy-MM-01" (last_month will be used if this arg is not present)
): YnabBudget => {
  const budgetMonth = month ?? response.last_month;
  const categoryGroupMap = response.category_groups
    .filter(({ hidden, deleted }) => !hidden && !deleted)
    .reduce((map, { id, name }) => {
      map[id] = {
        id,
        name,
        categories: [],
        budgeted: 0,
        activity: 0,
        balance: 0,
      };
      return map;
    }, {} as Record<string, YnabBudgetCategoryGroup>);

  // Attention: if the day in month arg is different than in response (eg. 2024-10-01 and 2024-10-05) no data budget will be returned
  // We could return last month instead (`budgetCategoriesInMonth = response.categories`) but it might be misleading
  const budgetCategoriesInMonth =
    response.months.find(({ month }) => month === budgetMonth)?.categories ??
    [];
  budgetCategoriesInMonth
    .filter(({ hidden, deleted }) => !hidden && !deleted)
    .forEach((cat) => {
      categoryGroupMap[cat.category_group_id].categories.push({
        name: cat.name,
        budgeted: cat.budgeted,
        activity: cat.activity,
        balance: cat.balance,
      });
      categoryGroupMap[cat.category_group_id].budgeted += cat.budgeted;
      categoryGroupMap[cat.category_group_id].activity += cat.activity;
      categoryGroupMap[cat.category_group_id].balance += cat.balance;
    });

  const accounts = response.accounts
    .filter(({ closed, deleted }) => !closed && !deleted)
    .map((acc) => ({
      id: acc.id,
      name: acc.name,
      balance: acc.balance,
    }));

  return {
    lastModifiedOn: response.last_modified_on,
    month: budgetMonth.slice(0, 7), // "yyyy-MM-dd" → "yyyy-MM"
    categoryGroups: Object.values(categoryGroupMap),
    accounts: accounts,
  };
};
