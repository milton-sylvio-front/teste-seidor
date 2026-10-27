export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '')
}

export function mascararCpf(valor: string): string {
  const digitos = apenasDigitos(valor).slice(0, 11)

  return digitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function calcularDigitoCpf(base: string, pesoInicial: number): number {
  const soma = base
    .split('')
    .reduce((total, digito, indice) => total + Number(digito) * (pesoInicial - indice), 0)

  const resto = (soma * 10) % 11
  return resto === 10 ? 0 : resto
}

export function cpfValido(cpf: string): boolean {
  const digitos = apenasDigitos(cpf)

  if (digitos.length !== 11) {
    return false
  }

  if (/^(\d)\1{10}$/.test(digitos)) {
    return false
  }

  const primeiroDigito = calcularDigitoCpf(digitos.slice(0, 9), 10)
  const segundoDigito = calcularDigitoCpf(digitos.slice(0, 10), 11)

  return primeiroDigito === Number(digitos[9]) && segundoDigito === Number(digitos[10])
}
