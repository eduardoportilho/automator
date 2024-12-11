import { processArpoadorReport } from "./process-arpoador-report";

describe("processArpoadorReport", () => {
  describe("imovel", () => {
    it("parse and rename imóvel", () => {
      const { imovel } = processArpoadorReport(
        "Contrato243/1 - Loja no Ipanema, Rua Maria Quitéria 95 , Rio de Janeiro-RJ CEP: 22410-040"
      );

      expect(imovel).toBe("Rua Maria Quitéria 95");
    });
  });

  describe("mesCompetencia", () => {
    it("parse mês de competência", () => {
      const { mesCompetencia } = processArpoadorReport(
        "Referência04/12/2024Competência11/2024Pagamento04/12/2024"
      );

      expect(mesCompetencia).toBe("11/2024");
    });
  });

  describe("dataPagamento", () => {
    it("parse data de pagamento", () => {
      const { dataPagamento } = processArpoadorReport(
        "Referência04/12/2024Competência11/2024Pagamento04/12/2024"
      );

      expect(dataPagamento).toBe("04/12/2024");
    });
  });

  describe("taxaAdministracao", () => {
    it("parse taxa de administracao", () => {
      const { taxaAdministracao } = processArpoadorReport(
        "Taxa de administração-914,98"
      );

      expect(taxaAdministracao).toBe("-914,98");
    });
  });

  describe("valorIr", () => {
    it("parse valor IR with date", () => {
      const { valorIr } = processArpoadorReport(
        "IR - Eduardo Pilla Portilho (00/0000)-3.981,57"
      );

      expect(valorIr).toBe("-3.981,57");
    });
  });

  describe("valorRepasse", () => {
    it("parse valor repasse", () => {
      const { valorRepasse } = processArpoadorReport(
        "Total para repasse13.403,05"
      );

      expect(valorRepasse).toBe("13.403,05");
    });
  });

  describe("valorAluguel", () => {
    it("parse row with date range", () => {
      const { valorAluguel } = processArpoadorReport(
        "Aluguel - 01/11/2024 até 30/11/202418.299,60"
      );

      expect(valorAluguel).toBe("18.299,60");
    });

    it("parse row with one date", () => {
      const { valorAluguel } = processArpoadorReport(
        "Aluguel - 01/11/202418.299,60"
      );

      expect(valorAluguel).toBe("18.299,60");
    });

    it("parse row without date", () => {
      const { valorAluguel } = processArpoadorReport("Aluguel18.299,60");

      expect(valorAluguel).toBe("18.299,60");
    });
  });
});
