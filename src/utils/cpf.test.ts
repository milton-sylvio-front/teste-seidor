import { cpfValido, mascararCpf } from './cpf'

describe('cpf', () => {
  it('mascara o CPF enquanto o usuário digita', () => {
    expect(mascararCpf('52998224725')).toBe('529.982.247-25')
  })

  it('aceita CPFs válidos', () => {
    expect(cpfValido('529.982.247-25')).toBe(true)
    expect(cpfValido('390.533.447-05')).toBe(true)
    expect(cpfValido('111.444.777-35')).toBe(true)
  })

  it('rejeita CPFs inválidos ou repetidos', () => {
    expect(cpfValido('123.456.789-00')).toBe(false)
    expect(cpfValido('000.000.000-00')).toBe(false)
    expect(cpfValido('529.982.247-26')).toBe(false)
  })
})
