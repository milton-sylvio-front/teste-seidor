import { formatarMoeda, parseNumero } from './format'

function moeda(valor: string): string {
  return valor.replace(/\s/g, ' ')
}

describe('format', () => {
  describe('formatarMoeda', () => {
    it('formata valores em real brasileiro', () => {
      expect(moeda(formatarMoeda(2500))).toBe('R$ 2.500,00')
      expect(moeda(formatarMoeda(32.34))).toBe('R$ 32,34')
    })

    it('formata zero', () => {
      expect(moeda(formatarMoeda(0))).toBe('R$ 0,00')
    })
  })

  describe('parseNumero', () => {
    it('converte vírgula decimal em número', () => {
      expect(parseNumero('1234,56')).toBe(1234.56)
      expect(parseNumero('10,5')).toBe(10.5)
    })

    it('ignora espaços ao redor e no meio do valor', () => {
      expect(parseNumero('  10,5  ')).toBe(10.5)
      expect(parseNumero('1 234')).toBe(1234)
    })

    it('aceita ponto como separador decimal', () => {
      expect(parseNumero('99.9')).toBe(99.9)
    })

    it('aceita zero e números negativos', () => {
      expect(parseNumero('0')).toBe(0)
      expect(parseNumero('-12,5')).toBe(-12.5)
    })

    it('retorna null para vazio ou não numérico', () => {
      expect(parseNumero('')).toBeNull()
      expect(parseNumero('   ')).toBeNull()
      expect(parseNumero('abc')).toBeNull()
      expect(parseNumero('10,5,2')).toBeNull()
    })
  })
})
