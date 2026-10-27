import { describe, expect, it } from 'vitest'
import {
  calcularDescontoIRRF,
  calcularSalarioBaseIR,
  criarFuncionario,
  DEDUCAO_POR_DEPENDENTE,
} from './irrf'

describe('cálculo de IRRF', () => {
  it('calcula o salário-base descontando previdência e dependentes', () => {
    const salarioBase = calcularSalarioBaseIR(5000, 500, 2)
    expect(salarioBase).toBe(5000 - 500 - DEDUCAO_POR_DEPENDENTE * 2)
  })

  it('mantém isenção até 2259,20', () => {
    expect(calcularDescontoIRRF(2259.2)).toBe(0)
  })

  it('aplica a alíquota de 7,5% na segunda faixa', () => {
    const desconto = calcularDescontoIRRF(2700)
    expect(desconto).toBe(33.06)
  })

  it('aplica a alíquota de 15% na terceira faixa', () => {
    const desconto = calcularDescontoIRRF(3000)
    expect(desconto).toBe(68.56)
  })

  it('aplica a alíquota de 22,5% na quarta faixa', () => {
    const desconto = calcularDescontoIRRF(4000)
    expect(desconto).toBe(237.23)
  })

  it('aplica a alíquota de 27,5% na última faixa', () => {
    const desconto = calcularDescontoIRRF(5000)
    expect(desconto).toBe(479)
  })

  it('não retorna desconto negativo na faixa isenta', () => {
    expect(calcularDescontoIRRF(1000)).toBe(0)
  })

  it('compõe o funcionário com os valores calculados', () => {
    const funcionario = criarFuncionario(
      {
        nome: 'Teste',
        cpf: '529.982.247-25',
        salarioBruto: 3000,
        descontoPrevidencia: 300,
        dependentes: 0,
      },
      'id-teste',
    )

    expect(funcionario.salarioBaseIR).toBe(2700)
    expect(funcionario.descontoIRRF).toBe(33.06)
  })
})
