# 💷 Patrimônio (2025) 💶 - Google Sheet

## 1. Relatório

Reads values from DB sheets and present them on an easy to read way

### Creating a new entry:

1. Update YNAB, generate entries in `db. YNAB` and `db. Investimentos` sheets
2. Enter the values for the top rows in a new colum:

- 2: Date anchor in 'db. YNAB' (eg. `db. YNAB!C1`)
- 3: Date anchor in 'db. Investimentos' (eg. `db. Investimentos!H1`)
- 4: Mês (eg. 2024-10)

3. Copy the formulas of the last column and check the references

### Formula break-down:

#### Buscar valor em named range

`=OFFSET(InvestLiquidez;0;COLUMN(INDIRECT(E$3))-1;1;1)`

- `InvestLiquidez` é um named range na planilha com os dados que inclui uma linha inteira, i.e., podemos usar qualquer índice de colunas da planilha nele.
- `E$3` aponta para o date anchor na planilha com os dados. Essa célula é usada para obter o índice da coluna. Ex. conteúdo: `db. Investimentos!H1`
- `INDIRECT(E$3)` converte o conteúdo da célula (string) em uma referência que pode ser usada em fórmulas
- `COLUMN(ref)-1` obtém o índice da coluna e subtrai 1 para usar no offset, ex. `db. Investimentos!B1` → `B=2 (1-indexed)` -> `2-1 = 1`
- `=OFFSET(InvestLiquidez;0;COL-1;1;1)` obtém o valor do named range na coluna
  - InvestLiquidez: named range
  - 0: não desloca linhas
  - COL-1: desloca colunas (ex: A=1 (1-indexed) → 1-1=0 → não desloca nenhuma coluna para A)
  - 1,1: resultado vai ser 1 coluna e 1 linha, ou seja, apenas um valor

#### Old

`=OFFSET(INDIRECT($E$2);42+A7;0)`

- Look for values shifted from the **date anchors** in the `db. YNAB` and `db. Investimentos` sheets
- We store the `cell_reference_as_string` of the **date anchors** in the top of the column (`$E$2` and `$E$2`)
  - eg. `db. YNAB!C1` (stored in E2) points to date anchor of the entry we want to look in `db. YNAB`
- `INDIRECT($E$2)` converts this `cell_reference_as_string` into a reference that the formula can use
- `42+A7` is the number of rows to shift down from the **date anchor** (hard-coded)
- `0` is the number of columns to shift - 0 since we are looking at the same column.
- `OFFSET(ref; rows; cols)` reads the cell shifted from ref.

**Formula reference**:

- [OFFSET](https://support.google.com/docs/answer/3093379?sjid=14221480554448374696-SA): Returns the content of a cell shifted a number of rows and columns from a starting cell reference.
  - params: cell_reference, rows, columns
- [INDIRECT](https://support.google.com/docs/answer/3093377?sjid=14221480554448374696-SA): Returns a cell reference specified by a string.
  - cell_reference_as_string: ex: `Sheet Name!B10`, `A1`
