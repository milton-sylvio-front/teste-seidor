# Gestão de Funcionários e IRRF

Aplicação React para cadastro de funcionários e cálculo automático do Imposto de Renda Retido na Fonte (IRRF).

## Funcionalidades

- Cadastrar funcionário (nome, CPF, salário bruto, desconto da previdência e dependentes)
- Atualizar e excluir funcionários
- Listar nome, CPF, salário, desconto, dependentes e desconto de IRPF
- Filtrar a lista por nome e CPF
- Calcular o salário-base de IR e o desconto de IRRF pela tabela progressiva

## Fórmulas

```text
Salário Base IR = Salário bruto - Desconto da previdência - (R$ 189,59 × quantidade de dependentes)
Desconto IRRF   = Salário Base IR × Alíquota - Parcela a deduzir
```

Faixas utilizadas:

| Base de cálculo              | Alíquota | Parcela a deduzir |
| ---------------------------- | -------- | ----------------- |
| Até R$ 2.259,20              | Isento   | R$ 0,00           |
| De R$ 2.259,21 até R$ 2.826,65 | 7,5%   | R$ 169,44         |
| De R$ 2.826,66 até R$ 3.751,05 | 15%    | R$ 381,44         |
| De R$ 3.751,06 até R$ 4.664,68 | 22,5%  | R$ 662,77         |
| Acima de R$ 4.664,68         | 27,5%    | R$ 896,00         |

## Stack

- React + TypeScript + Vite
- Redux Toolkit para persistir os funcionários em memória
- React Testing Library + Vitest

Os exemplos iniciais estão em `src/data/funcionarios.json`.

## Como executar

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

## Como testar

```bash
npm test
```

Build de produção:

```bash
npm run build
npm run preview
```
