import { format, parse } from "date-fns";
import { findSectionByHeader } from "../../utils/sheet-search/sheet-search";
import {
  YnabBudget,
  YnabBudgetCategoryGroup,
  YnabBudgetCategory,
} from "../../types";
import { splitCsv } from "../../utils/rows";
import { parseAmountBR } from "../../utils/currency/currency";
import { YNAB_MONTH_FORMAT, ISO_MONTH_FORMAT } from "../../utils/date/date";

/**
 * Sep 2024 → 2024/09
 */
const parseMonthVerbose = (monthVerbose: string) => {
  const date = parse(monthVerbose, YNAB_MONTH_FORMAT, new Date());
  return format(date, ISO_MONTH_FORMAT);
};

const getCategory = (
  categoryGroup: YnabBudgetCategoryGroup,
  categoryName: string
): YnabBudgetCategory => {
  let category = categoryGroup.categories.find(
    ({ name }) => name === categoryName
  );
  if (!category) {
    category = {
      name: categoryName,
      budgeted: 0,
      activity: 0,
      balance: 0,
    };
    categoryGroup.categories = [...categoryGroup.categories, category];
  }
  return category;
};

const getCategoryGroup = (
  budget: YnabBudget,
  categoryGroupName: string
): YnabBudgetCategoryGroup => {
  let categoryGroup = budget.categoryGroups.find(
    ({ name }) => name === categoryGroupName
  );
  if (!categoryGroup) {
    categoryGroup = {
      id: categoryGroupName,
      name: categoryGroupName,
      categories: [],
      budgeted: 0,
      activity: 0,
      balance: 0,
    };
    budget.categoryGroups = [...budget.categoryGroups, categoryGroup];
  }
  return categoryGroup;
};

/**
 * Convert ynab budget TSV content to YnabBudget object
 * @param tsvContent
 * @param month yyyy-MM
 * @returns
 */
export const convertYnabBudgetTsvTo = (
  tsvContent: string,
  month: string
): YnabBudget => {
  const rows = splitCsv({
    content: tsvContent,
    separator: "\t",
    options: {
      removeCellQuotes: true,
    },
  });

  const categoriesRows = findSectionByHeader({
    headerValue: "Category Group/Category",
    rows,
  });

  const ynabBudget = categoriesRows.reduce(
    (budget, row) => {
      const [
        monthCell,
        categoryGroupCategory,
        categoryGroupCell,
        categoryCell,
        budgetedCell,
        activityCell,
        availableCell,
      ] = row;

      const rowMonth = parseMonthVerbose(monthCell.toString());
      if (rowMonth !== month) {
        return budget;
      }

      const categoryGroup = getCategoryGroup(
        budget,
        categoryGroupCell.toString()
      );

      const category = getCategory(categoryGroup, categoryCell.toString());

      category.budgeted = parseAmountBR(budgetedCell.toString());
      category.activity = parseAmountBR(activityCell.toString());
      category.balance = parseAmountBR(availableCell.toString());

      return budget;
    },
    { month, categoryGroups: [] } as YnabBudget
  );

  return ynabBudget;
};
