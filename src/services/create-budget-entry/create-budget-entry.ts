import { format } from "date-fns";
import { YnabBudget, SheetContent } from "../../types";
import { NEXT_DATE_ANCHOR } from "../../constants";
import { findSectionByHeader } from "../../utils/sheet-search/sheet-search";
import { YNAB_DATE_FORMAT } from "../../utils/date/date";
import { getCategoryActivity } from "./services/get-budget-activity/get-budget-activity";
import { createReportSection } from "./services/create-report-section/create-report-section";
import { convertYnabToAmount } from "../../utils/currency/currency";

const createCategoriesSection = ({
  sheetContent,
  budget,
}: {
  sheetContent: SheetContent;
  budget: YnabBudget;
}) => {
  // TODO: warn about mismatch between CATEGORIES in sheetContent and budget
  const categories = findSectionByHeader({
    rows: sheetContent,
    headerValue: "Category",
  }).map((row) => {
    const [categoryGroupName, categoryName] = row;
    return {
      categoryGroupName: categoryGroupName.toString(),
      categoryName: categoryName.toString(),
    };
  });

  return [
    [budget.month],
    ...categories.map(({ categoryGroupName, categoryName }) => [
      getCategoryActivity({
        budget,
        categoryGroupName,
        categoryName,
      }),
    ]),
  ];
};

const createAccountsSection = ({
  sheetContent,
  budget,
}: {
  sheetContent: SheetContent;
  budget: YnabBudget;
}) => {
  const processingDate = format(new Date(), YNAB_DATE_FORMAT);

  const accountNames = findSectionByHeader({
    rows: sheetContent,
    headerValue: "Account",
  }).map((row) => row[0]);

  // TODO: warn about mismatch between ACCOUNTS in sheetContent and budget
  return [
    [processingDate],
    ...accountNames.map((accountName) => {
      const account = budget.accounts.find(({ name }) => name === accountName);

      if (account) {
        return [convertYnabToAmount(account.balance)];
      }
      return [];
    }),
  ];
};

export const createBudgetEntry = ({
  sheetContent,
  budget,
}: {
  sheetContent: SheetContent;
  budget: YnabBudget;
}) => {
  const processingDate = format(new Date(), YNAB_DATE_FORMAT);

  const categoriesSection = createCategoriesSection({ sheetContent, budget });
  const accountsSection = createAccountsSection({ sheetContent, budget });

  // Report is generated here
  const reportSection = createReportSection({ sheetContent, budget });

  return [
    [processingDate, NEXT_DATE_ANCHOR],
    [],
    ...categoriesSection,
    [],
    ...accountsSection,
    [],
    ...reportSection,
  ];
};
