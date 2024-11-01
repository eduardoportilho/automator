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

### 1. Gerar entrada na planilha `💷 Patrimônio (2025) 💶` / `db. Investimentos`

1.1. Carteira XP

- Salvar XLS em `/carteira-xp-to-sheets`

  - Uma nova entrada será criada em `db. Investimentos` com a data de hoje
  - Copiar formatação da entrada anterior

    1.2. Safra

- Investimentos - Renda fixa - Ver detalhes: Copiar tabela para `tmp. Safra`
- Investimentos - Ações, ... - Ver detalhes: Copiar tabela para `tmp. Safra`
  - Todos os fundos e ações devem exstir na planilha
- No Google sheets, baixar como TSV a planilha `tmp. Safra` e salvar em `/carteira-safra-to-sheets`

  1.3. Itaú

- Copiar manualmente:

  - CDB-DI - Saldo bruto → Posição
  - CDB-DI - Saldo líquido → Valor líquido
  - Balanceado Ativo FMP FGTS Carteira Livre - Valor investido → Posição E Valor Liquido

    1.4. Toptal

- Copiar saldo para USD
- Copiar valor "USD → BRL" col B para "USD → BRL" da entrada
- Copiar fórmula "Conversão BRL" da entrada anterior

  1.5. Outros

- Copiar fórmulas da sessão "Relatório" da entrada anterior

### 2. Gerar entrada na planilha `💷 Patrimônio (2025) 💶` / `db. YNAB`

- Shell:

```
$ j automator
$ ./src/scripts/ynab-budget-api-to-sheets.ts $BUDGET_EDU_2025 $YNAB_ACCESS_TOKEN 2024-10-01
```

### 2. Gerar entrada na planilha `💷 Patrimônio (2025) 💶` / `1. Relatório`

- Na planilha "1. Relatório"
  - Copiar valores da entrada anterior: "Date anchor in 'db. YNAB'", "Date anchor in 'db. Investimentos'", "Mês"
  - Ajustar valores:
    - "Date anchor in 'db. YNAB'": referência da célula com a data a ser utilizada na planilha 'db. YNAB', ex. `db. YNAB!D1`
    - "Date anchor in 'db. Investimentos'": referência da célula com a data a ser utilizada na planilha 'db. Investimentos', ex. `db. Investimentos!L1`
    - "Mês": Mês dos dados utilizados nesse relatório, ex. 2024-10 se o relatório foi gerado após o final de outubro
