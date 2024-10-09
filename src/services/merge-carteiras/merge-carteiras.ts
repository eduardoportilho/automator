import { Acao, Carteira, Fundo } from "../../types";

const isSameAcao = (base: Acao) => (compare: Acao) =>
  base.ativo === compare.ativo;

const notIncludedInAcoes = (base: Acao[]) => (search: Acao) =>
  base.findIndex(isSameAcao(search)) < 0;

const mergeAcoes = (base: Acao[], override: Acao[]) => {
  const keepFromBase = base.filter(notIncludedInAcoes(override));
  return [...override, ...keepFromBase];
};

const isSameFundo = (base: Fundo) => (compare: Fundo) =>
  base.nome === compare.nome;

const notIncludedInFundos = (base: Fundo[]) => (search: Fundo) =>
  base.findIndex(isSameFundo(search)) < 0;

const mergeFundo = (base: Fundo[], override: Fundo[]) => {
  const keepFromBase = base.filter(notIncludedInFundos(override));
  return [...override, ...keepFromBase];
};

export const mergeCarteiras = (base: Carteira, override: Carteira) => {
  const fiis = mergeAcoes(base.fiis, override.fiis);
  const acoes = mergeAcoes(base.acoes, override.acoes);
  const rendaFixa = mergeFundo(base.rendaFixa, override.rendaFixa);
  const fundos = mergeFundo(base.fundos, override.fundos);

  return {
    fiis,
    acoes,
    rendaFixa,
    fundos,
  };
};
