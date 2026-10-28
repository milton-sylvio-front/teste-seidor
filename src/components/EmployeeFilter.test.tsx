import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { estadoEmployees, renderWithStore } from '../test/renderWithStore'
import { EmployeeFilter } from './EmployeeFilter'

describe('EmployeeFilter', () => {
  it('renderiza os campos de filtro por nome e CPF', () => {
    renderWithStore(<EmployeeFilter />, {
      preloadedState: estadoEmployees(),
    })

    expect(
      screen.getByRole('region', { name: 'Filtros da listagem' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Filtrar por nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Filtrar por CPF')).toBeInTheDocument()
  })

  it('atualiza o filtro de nome no store', async () => {
    const user = userEvent.setup()
    const { store } = renderWithStore(<EmployeeFilter />, {
      preloadedState: estadoEmployees(),
    })

    await user.type(screen.getByLabelText('Filtrar por nome'), 'Ana')

    expect(store.getState().employees.filtroNome).toBe('Ana')
  })

  it('mascara o CPF enquanto o usuário digita o filtro', async () => {
    const user = userEvent.setup()
    const { store } = renderWithStore(<EmployeeFilter />, {
      preloadedState: estadoEmployees(),
    })

    await user.type(screen.getByLabelText('Filtrar por CPF'), '52998224725')

    expect(screen.getByLabelText('Filtrar por CPF')).toHaveValue('529.982.247-25')
    expect(store.getState().employees.filtroCpf).toBe('529.982.247-25')
  })
})
