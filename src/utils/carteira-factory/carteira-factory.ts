import { Acao, Fundo } from "../../types";
import { parseCellNumber } from "../cell-value/cell-value";
import { roundCurrency } from "../currency/currency";

export const createAcao = ({
  ativo,
  cotacao,
  quantidade,
  posicao,
}: {
  ativo: string;
  cotacao: string | number;
  quantidade: string | number;
  posicao?: string | number;
}): Acao => {
  const cotacaoNumber = parseCellNumber(cotacao);
  const quantidadeNumber = parseCellNumber(quantidade);

  let posicaoNumber: number;
  if (posicao) {
    posicaoNumber = parseCellNumber(posicao);
  } else {
    posicaoNumber = roundCurrency(quantidadeNumber * cotacaoNumber);
  }

  return {
    ativo,
    cotacao: cotacaoNumber,
    quantidade: quantidadeNumber,
    posicao: posicaoNumber,
  };
};

export const createFundo = ({
  nome,
  quantidade,
  precoUnitario,
  posicaoMercado,
  valorLiquido,
}: {
  nome: string;
  quantidade?: string | number;
  precoUnitario?: string | number;
  posicaoMercado?: string | number;
  valorLiquido?: string | number;
}): Fundo => {
  let quantidadeNumber = quantidade ? parseCellNumber(quantidade) : undefined;
  let precoUnitarioNumber = precoUnitario
    ? parseCellNumber(precoUnitario)
    : undefined;
  let posicaoMercadoNumber = posicaoMercado
    ? parseCellNumber(posicaoMercado)
    : 0;
  let valorLiquidoNumber = valorLiquido ? parseCellNumber(valorLiquido) : 0;

  if (!valorLiquidoNumber && posicaoMercadoNumber) {
    valorLiquidoNumber = posicaoMercadoNumber;
  } else if (!posicaoMercadoNumber && valorLiquidoNumber) {
    posicaoMercadoNumber = valorLiquidoNumber;
  }

  if (!precoUnitarioNumber && valorLiquidoNumber && quantidadeNumber) {
    precoUnitarioNumber = roundCurrency(valorLiquidoNumber / quantidadeNumber);
  }

  return {
    nome,
    quantidade: quantidadeNumber,
    precoUnitario: precoUnitarioNumber,
    posicaoMercado: posicaoMercadoNumber,
    valorLiquido: valorLiquidoNumber,
  };
};
