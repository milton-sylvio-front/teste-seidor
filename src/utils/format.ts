const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatarMoeda(valor: number): string {
  return formatadorMoeda.format(valor)
}

export function parseNumero(valor: string): number | null {
  const normalizado = valor.trim().replace(/\s/g, '').replace(',', '.')

  if (!normalizado) {
    return null
  }

  const numero = Number(normalizado)
  return Number.isFinite(numero) ? numero : null
}
