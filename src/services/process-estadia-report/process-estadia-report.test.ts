import { LEBLON } from "../../constants";
import {
  isEstadiaReport,
  processEstadiaReport,
} from "./process-estadia-report";

const exemplo1 = `
...
22 nov 2025 - 30 nov 2025 - 8 Nights
Aluguel
R$ 4.773,19
Estadia
R$ 954,64
ReservasReceitasDespesasSaldo
R$ 3.818,55R$ 0,00R$ 0,00R$ 3.818,55
Estadia Carioca
...
`;

const buildExemplo = ({
  dti = "21 dez 2025",
  dtf = "26 dez 2025",
  noites = "5 Noite(s)",
  aluguel = "R$ 4.489,49",
  estadia = "R$ 897,90",
  saldo = "R$ 3.591,59",
}: {
  dti?: string;
  dtf?: string;
  noites?: string;
  aluguel?: string;
  estadia?: string;
  saldo?: string;
}) => `
...
${dti} - ${dtf} - ${noites}
Aluguel
${aluguel}
Estadia
${estadia}
ReservasReceitasDespesasSaldo
${saldo}R$ 0,00R$ 0,00${saldo}
Estadia Carioca
...
`;

describe("processEstadiaReport", () => {
  describe("isEstadiaReport", () => {
    it("return true when 'Estadia Carioca' is present", () => {
      expect(isEstadiaReport(exemplo1)).toBe(true);
      expect(isEstadiaReport("...Estadia Carioca...")).toBe(true);
    });

    it("return false when 'Estadia Carioca' is not present", () => {
      expect(isEstadiaReport("...estadia carioca...")).toBe(false);
      expect(isEstadiaReport("... Estadia ...")).toBe(false);
      expect(isEstadiaReport("... Carioca ...")).toBe(false);
    });
  });

  describe("processEstadiaReport", () => {
    it("return LEBLON, mesCompetencia='' valorIr=0", () => {
      const entry1 = processEstadiaReport(exemplo1);

      expect(entry1.imovel).toEqual(LEBLON);
      expect(entry1.mesCompetencia).toEqual("");
      expect(entry1.valorIr).toEqual(0);
    });

    it("return valor aluguel", () => {
      const entry1 = processEstadiaReport(
        buildExemplo({ aluguel: "R$ 1.234,56" })
      );

      expect(entry1.valorAluguel).toEqual(1234.56);
    });

    it("return estadia as taxa administracao", () => {
      const entry1 = processEstadiaReport(
        buildExemplo({ estadia: "R$ 1.234,56" })
      );

      expect(entry1.taxaAdministracao).toEqual(1234.56);
    });

    it("return saldo as valor repasse", () => {
      const entry1 = processEstadiaReport(
        buildExemplo({ saldo: "R$ 1.234,56" })
      );

      expect(entry1.valorRepasse).toEqual(1234.56);
    });

    it("return noites as numeroDiarias when valid", () => {
      const entry1 = processEstadiaReport(
        buildExemplo({
          dti: "21 dez 2025",
          dtf: "22 dez 2025",
          noites: "5 Noite(s)",
        })
      );

      expect(entry1.numeroDiarias).toEqual(5);
    });

    it("return date diff as numeroDiarias when noites is not valid", () => {
      const entry1 = processEstadiaReport(
        buildExemplo({
          dti: "21 dez 2025",
          dtf: "22 dez 2025",
          noites: "X Noite(s)",
        })
      );

      expect(entry1.numeroDiarias).toEqual(1);
    });

    it("return diaria liquida", () => {
      const entry1 = processEstadiaReport(
        buildExemplo({
          saldo: "R$ 1.234,56",
          noites: "5 Noite(s)",
        })
      );

      expect(entry1.diariaLiquida).toEqual(246.91);
    });
  });
});
