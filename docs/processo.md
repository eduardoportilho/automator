# Processo

## Toda a semana

1. Atualizar YNAB Edu

1.1. Itaú

- Extrato: Salvar TXT extrato em `/extrato-itau-to-ynab`
- Cartão: Salvar Excel extrato em `/fatura-itau-to-ynab`
  - Verificar saldo, reconciliar
  - Se encontrar tx que pode ser renomeada, adicionar em `process-extrato-itau.ts` ou `process-fatura-itau.ts`
- Investimentos / CDB: copiar "valor investido" e adicionar tx no YNAB para igualar

  1.2. Safra

- Extrato: Salvar CSV extrato em `/extrato-safra-csv-to-ynab`

  1.3. XP

- Extrato: Salvar XLS extrato em `/extrato-xp-to-ynab`
- Cartão: App - Detalhes da fatura - Exportar fatura (CSV)
  - Salvar CSV em `/fatura-xp-to-ynab`

## No final do mês

1. Gerar entrada na planilha "💷 Patrimônio (2025) 💶""

1.1. Carteira XP

- Salvar XLS em `/carteira-xp-to-sheets`

  - Uma nova entrada será criada em `db. Investimentos` com a data de hoje
  - Copiar formatação da entrada anterior

  1.2. Safra

- Investimentos - Renda fixa - Ver detalhes: Copiar tabela para `tmp. Safra`
- Investimentos - Ações, ... - Ver detalhes: Copiar tabela para `tmp. Safra`
  - Todos os fundos e ações devem exstir na planilha
