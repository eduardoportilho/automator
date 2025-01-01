import {
  getPeriodoEstadia,
  getValorAluguelRepasseAdm,
} from "./process-estadia-report";

describe("processEstadiaReport", () => {
  describe("getPeriodoEstadia", () => {
    it("get numero diarias from a single row", () => {
      const { numeroDiarias } = getPeriodoEstadia([
        "ReservaPeriodo de estadiaValor do aluguel*ComissãoPago ao proprietário",
        "late check-out Miguel22-01-2024 - 23-01-2024250.0050.00200.00",
        "Subtotal:  250,00  50,00200,00",
      ]);

      expect(numeroDiarias).toBe(1);
    });

    it("get numero diarias from multiple rows", () => {
      const { numeroDiarias } = getPeriodoEstadia([
        "ReservaPeriodo de estadiaValor do aluguel*ComissãoPago ao proprietário",
        "Felipe13-01-2024 - 15-01-20241000.00-38.001038.00",
        "MIguel15-01-2024 - 22-01-20242982.43596.492385.94",
        "Subtotal:  3.982,43  558,493.423,94",
      ]);

      expect(numeroDiarias).toBe(2 + 7);
    });
  });

  describe("getValorAluguelRepasseAdm", () => {
    it("get aluguel, adm and repasse", () => {
      const { valorAluguel, taxaAdministracao, valorRepasse } =
        getValorAluguelRepasseAdm([
          "Subtotal:  20.146,54  4.029,3116.117,23",
          "TOTAL QUITAÇÃO:R$ 15.937,23",
        ]);

      expect(valorAluguel).toBe(20146.54);
      expect(taxaAdministracao).toBe(4029.31);
      expect(valorRepasse).toBe(15937.23);
    });
  });
});
