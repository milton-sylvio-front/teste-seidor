export type EmployeeInput = {
  nome: string
  cpf: string
  salarioBruto: number
  descontoPrevidencia: number
  dependentes: number
}

export type Employee = EmployeeInput & {
  id: string
  salarioBaseIR: number
  descontoIRRF: number
}

export type EmployeeFormValues = {
  nome: string
  cpf: string
  salarioBruto: string
  descontoPrevidencia: string
  dependentes: string
}
