import { processArpoadorReport } from "./process-arpoador-report";

const CONTENT_NO_IR = `
Contrato243/1 - Loja no Ipanema, Rua Maria Quitéria 95 , Rio de Janeiro-RJ CEP: 22410-040
Referência04/12/2024Competência11/2024Pagamento04/12/2024
Taxa de administração-914,98
Aluguel - 01/11/2024 até 30/11/202418.299,60
Total para repasse13.403,05
`;

const CONTENT = `
${CONTENT_NO_IR}
IR - Eduardo Pilla Portilho (00/0000)-3.981,57
`;

describe("processArpoadorReport", () => {
  describe("imovel", () => {
    it("parse and rename imóvel", () => {
      const { imovel } = processArpoadorReport(CONTENT);

      expect(imovel).toBe("Rua Maria Quitéria 95");
    });
  });

  describe("mesCompetencia", () => {
    it("parse mês de competência", () => {
      const { mesCompetencia } = processArpoadorReport(CONTENT);

      expect(mesCompetencia).toBe("11/2024");
    });
  });

  describe("dataPagamento", () => {
    it("parse data de pagamento", () => {
      const { dataPagamento } = processArpoadorReport(CONTENT);

      expect(dataPagamento).toBe("04/12/2024");
    });
  });

  describe("taxaAdministracao", () => {
    it("parse taxa de administracao", () => {
      const { taxaAdministracao } = processArpoadorReport(CONTENT);

      expect(taxaAdministracao).toBe(914.98);
    });
  });

  describe("valorIr", () => {
    it("parse valor IR with date", () => {
      const { valorIr } = processArpoadorReport(CONTENT);

      expect(valorIr).toBe(3981.57);
    });

    it("parse ignore content with no IR", () => {
      const { valorIr } = processArpoadorReport(CONTENT_NO_IR);

      expect(valorIr).toBeUndefined();
    });
  });

  describe("valorRepasse", () => {
    it("parse valor repasse", () => {
      const { valorRepasse } = processArpoadorReport(CONTENT);

      expect(valorRepasse).toBe(13403.05);
    });
  });

  describe("valorAluguel", () => {
    it("parse row with date range", () => {
      const { valorAluguel } = processArpoadorReport(CONTENT);

      expect(valorAluguel).toBe(18299.6);
    });

    it("parse row with one date", () => {
      const { valorAluguel } = processArpoadorReport(
        "Aluguel - 01/11/202418.299,60" + CONTENT
      );

      expect(valorAluguel).toBe(18299.6);
    });

    it("parse row without date", () => {
      const { valorAluguel } = processArpoadorReport(
        "Aluguel18.299,60" + CONTENT
      );

      expect(valorAluguel).toBe(18299.6);
    });
  });
});
