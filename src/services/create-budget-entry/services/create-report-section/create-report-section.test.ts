import { YnabBudget, SheetContent } from "../../../../types";
import { getGroupActivity } from "../get-budget-activity/get-budget-activity";
import { findSectionByHeader } from "../../../../utils/sheet-search/sheet-search";

import {
  createReportSection,
  ROW_HEADERS,
  ITAU_CDB_DI,
} from "./create-report-section";

jest.mock("../get-budget-activity/get-budget-activity", () => ({
  getGroupActivity: jest.fn(),
}));
jest.mock("../../../../utils/sheet-search/sheet-search", () => ({
  findSectionByHeader: jest.fn(),
}));

const getGroupActivityMock = getGroupActivity as jest.Mock;
const findSectionByHeaderMock = findSectionByHeader as jest.Mock;

const buildGetGroupActivityMock = (groups: Record<string, number>) => {
  getGroupActivityMock.mockImplementation(
    ({ groupName }: { groupName: string }) => {
      return groups[groupName] ?? 0;
    }
  );
};

describe("createReportSection", () => {
  beforeEach(() => {
    findSectionByHeaderMock.mockReturnValue(
      Object.values(ROW_HEADERS).map((val) => [val])
    );
  });

  it("returns correct values for gastoTotal, rendaTotal, and delta", () => {
    buildGetGroupActivityMock({
      "Renda Passiva": 1000,
      "Renda Ativa": 2000,
      Recorrentes: -100,
      Superfluos: -200,
      "Não-mensais": -300,
      Outros: -400,
    });

    const [, ...report] = createReportSection({
      sheetContent: {} as SheetContent,
      budget: {} as YnabBudget,
    }).map((array) => array[0]);

    const [
      rendaTotal,
      rendaPassiva,
      rendaAtiva,
      gastoTotal,
      recorrentes,
      superfluos,
      naoMensais,
      outros,
      delta,
      // liquidezYnab,
    ] = report;

    expect(rendaPassiva).toBe(1000);
    expect(rendaAtiva).toBe(2000);
    // rendaTotal = rendaPassiva + rendaAtiva
    expect(rendaTotal).toBe(3000);

    expect(recorrentes).toBe(-100);
    expect(superfluos).toBe(-200);
    expect(naoMensais).toBe(-300);
    expect(outros).toBe(-400);
    // gastoTotal = recorrentes + superfluos + naoMensais + outros;
    expect(gastoTotal).toBe(-1000);

    // delta = rendaTotal - gastoTotal
    expect(delta).toBe(2000);
  });

  it("returns the sum of account balances excluding ITAU_CDB_DI for liquidezYnab", () => {
    const budget = {
      accounts: [
        { name: "Account 1", balance: 1_000_000 },
        { name: "Account 2", balance: 500_000 },
        { name: "Account 3", balance: -400_000 },
        { name: ITAU_CDB_DI, balance: 50_000_000 },
      ],
    } as YnabBudget;

    const report = createReportSection({
      sheetContent: {} as SheetContent,
      budget,
    }).map((array) => array[0]);

    const liquidezYnab = report.at(-1);

    // convertYnabToAmount divides by 1000
    expect(liquidezYnab).toBe(1100);
  });
});
