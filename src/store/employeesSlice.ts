import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import funcionariosIniciais from '../data/funcionarios.json'
import { criarFuncionario } from '../domain/irrf'
import type { Employee, EmployeeInput } from '../types/employee'
import { apenasDigitos } from '../utils/cpf'

type EmployeesState = {
  items: Employee[]
  filtroNome: string
  filtroCpf: string
}

const funcionariosCarregados = funcionariosIniciais.map((funcionario) =>
  criarFuncionario(funcionario),
)

const initialState: EmployeesState = {
  items: funcionariosCarregados,
  filtroNome: '',
  filtroCpf: '',
}

function cpfIgual(cpfA: string, cpfB: string): boolean {
  return apenasDigitos(cpfA) === apenasDigitos(cpfB)
}

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee(state, action: PayloadAction<EmployeeInput>) {
      state.items.push(criarFuncionario(action.payload))
    },
    updateEmployee(
      state,
      action: PayloadAction<{ id: string; data: EmployeeInput }>,
    ) {
      const indice = state.items.findIndex((item) => item.id === action.payload.id)

      if (indice === -1) {
        return
      }

      state.items[indice] = criarFuncionario(action.payload.data, action.payload.id)
    },
    removeEmployee(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setFiltroNome(state, action: PayloadAction<string>) {
      state.filtroNome = action.payload
    },
    setFiltroCpf(state, action: PayloadAction<string>) {
      state.filtroCpf = action.payload
    },
  },
})

export const {
  addEmployee,
  updateEmployee,
  removeEmployee,
  setFiltroNome,
  setFiltroCpf,
} = employeesSlice.actions

export const employeesReducer = employeesSlice.reducer

export function selectEmployeesFiltrados(state: EmployeesState): Employee[] {
  const nomeFiltro = state.filtroNome.trim().toLowerCase()
  const cpfFiltro = apenasDigitos(state.filtroCpf)

  return state.items.filter((funcionario) => {
    const nomeOk = funcionario.nome.toLowerCase().includes(nomeFiltro)
    const cpfOk = apenasDigitos(funcionario.cpf).includes(cpfFiltro)
    return nomeOk && cpfOk
  })
}

export function cpfJaCadastrado(
  items: Employee[],
  cpf: string,
  idAtual?: string,
): boolean {
  return items.some(
    (funcionario) =>
      funcionario.id !== idAtual && cpfIgual(funcionario.cpf, cpf),
  )
}
