import type { Employee, EmployeeInput } from '../types/employee'

export const DEDUCAO_POR_DEPENDENTE = 189.59

export type FaixaIRRF = {
  limite: number
  aliquota: number
  parcelaADeduzir: number
}

export const TABELA_IRRF: readonly FaixaIRRF[] = [
  { limite: 2259.2, aliquota: 0, parcelaADeduzir: 0 },
  { limite: 2826.65, aliquota: 0.075, parcelaADeduzir: 169.44 },
  { limite: 3751.05, aliquota: 0.15, parcelaADeduzir: 381.44 },
  { limite: 4664.68, aliquota: 0.225, parcelaADeduzir: 662.77 },
  { limite: Number.POSITIVE_INFINITY, aliquota: 0.275, parcelaADeduzir: 896 },
]

export function arredondarMoeda(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100
}

export function calcularSalarioBaseIR(
  salarioBruto: number,
  descontoPrevidencia: number,
  dependentes: number,
): number {
  const base =
    salarioBruto - descontoPrevidencia - DEDUCAO_POR_DEPENDENTE * dependentes
  return arredondarMoeda(Math.max(0, base))
}

export function obterFaixaIRRF(salarioBaseIR: number): FaixaIRRF {
  const faixa = TABELA_IRRF.find((item) => salarioBaseIR <= item.limite)
  return faixa ?? TABELA_IRRF[TABELA_IRRF.length - 1]
}

export function calcularDescontoIRRF(salarioBaseIR: number): number {
  const faixa = obterFaixaIRRF(salarioBaseIR)
  const desconto = salarioBaseIR * faixa.aliquota - faixa.parcelaADeduzir
  return arredondarMoeda(Math.max(0, desconto))
}

export function calcularImpostos(input: EmployeeInput) {
  const salarioBaseIR = calcularSalarioBaseIR(
    input.salarioBruto,
    input.descontoPrevidencia,
    input.dependentes,
  )

  return {
    salarioBaseIR,
    descontoIRRF: calcularDescontoIRRF(salarioBaseIR),
  }
}

export function criarFuncionario(
  input: EmployeeInput,
  id = crypto.randomUUID(),
): Employee {
  return {
    id,
    ...input,
    ...calcularImpostos(input),
  }
}
