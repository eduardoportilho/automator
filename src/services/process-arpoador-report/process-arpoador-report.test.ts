import { processArpoadorReport } from "./process-arpoador-report";

const buildContent = ({
  rowsBefore = [],
  rowImovel = "Contrato243/1 - Loja no Ipanema, Rua Maria Quitéria 95 , Rio de Janeiro-RJ CEP: 22410-040",
  rowDatas = "Referência04/12/2024Competência11/2024Pagamento04/12/2024",
  rowTxAdm = "Taxa de administração-914,98",
  rowAluguel = "Aluguel - 01/11/2024 até 30/11/202418.299,60",
  rowRepasse = "Total para repasse13.403,05",
  rowIR = "IR - Eduardo Pilla Portilho (00/0000)-3.981,57",
}: {
  rowsBefore?: string[];
  rowImovel?: string;
  rowDatas?: string;
  rowTxAdm?: string;
  rowAluguel?: string;
  rowRepasse?: string;
  rowIR?: string;
} = {}) => {
  return [
    ...rowsBefore,
    rowImovel,
    rowDatas,
    rowTxAdm,
    rowAluguel,
    rowRepasse,
    rowIR,
  ].join("\n");
};

describe("processArpoadorReport", () => {
  describe("imovel", () => {
    it("parse and rename imóvel", () => {
      const { imovel } = processArpoadorReport(buildContent());

      expect(imovel).toBe("Rua Maria Quitéria 95");
    });
  });

  describe("mesCompetencia", () => {
    it("parse mês de competência", () => {
      const { mesCompetencia } = processArpoadorReport(buildContent());

      expect(mesCompetencia).toBe("11/2024");
    });
  });

  describe("dataPagamento", () => {
    it("parse data de pagamento", () => {
      const { dataPagamento } = processArpoadorReport(buildContent());

      expect(dataPagamento).toBe("04/12/2024");
    });
  });

  describe("taxaAdministracao", () => {
    it("parse taxa de administracao", () => {
      const { taxaAdministracao } = processArpoadorReport(buildContent());

      expect(taxaAdministracao).toBe(914.98);
    });
  });

  describe("valorIr", () => {
    it("parse valor IR with date", () => {
      const { valorIr } = processArpoadorReport(buildContent());

      expect(valorIr).toBe(3981.57);
    });

    it("parse ignore content with no IR", () => {
      const { valorIr } = processArpoadorReport(buildContent({ rowIR: "" }));

      expect(valorIr).toBeUndefined();
    });
  });

  describe("valorRepasse", () => {
    it("parse valor repasse", () => {
      const { valorRepasse } = processArpoadorReport(buildContent());

      expect(valorRepasse).toBe(13403.05);
    });
  });

  describe("valorAluguel", () => {
    it("parse row with date range", () => {
      const { valorAluguel } = processArpoadorReport(buildContent());

      expect(valorAluguel).toBe(18299.6);
    });

    it("parse row with one date", () => {
      const { valorAluguel } = processArpoadorReport(
        buildContent({ rowAluguel: "Aluguel - 01/11/202418.299,60" })
      );

      expect(valorAluguel).toBe(18299.6);
    });

    it("parse row without date", () => {
      const { valorAluguel } = processArpoadorReport(
        buildContent({ rowAluguel: "Aluguel18.299,60" })
      );

      expect(valorAluguel).toBe(18299.6);
    });

    it("parse row with space", () => {
      const { valorAluguel } = processArpoadorReport(
        buildContent({
          rowAluguel: "Aluguel - 20/08/2024 até 19/09/2024 893,24",
        })
      );

      expect(valorAluguel).toBe(893.24);
    });
  });

  it('remove rows before "Extrato...."', () => {
    const {
      imovel,
      dataPagamento,
      mesCompetencia,
      valorAluguel,
      taxaAdministracao,
      valorIr,
      valorRepasse,
    } = processArpoadorReport(
      buildContent({
        rowsBefore: [
          "Contrato Imovel Inválido",
          "Referência01/01/2000Competência11/2024Pagamento01/01/2000",
          "Taxa de administração-1,00",
          "Aluguel - 01/11/2024 até 30/11/20241,00",
          "Total para repasse1,00",
          "IR - Eduardo Pilla Portilho (00/0000)-1,00",
          "Extrato", // will ignore everything above this row
        ],
      })
    );

    expect(imovel).toBe("Rua Maria Quitéria 95");
    expect(mesCompetencia).toBe("11/2024");
    expect(dataPagamento).toBe("04/12/2024");
    expect(taxaAdministracao).toBe(914.98);
    expect(valorIr).toBe(3981.57);
    expect(valorRepasse).toBe(13403.05);
    expect(valorAluguel).toBe(18299.6);
  });
});
