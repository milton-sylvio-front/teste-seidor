import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { criarFuncionario } from '../domain/irrf'
import { estadoEmployees, renderWithStore } from '../test/renderWithStore'
import { formatarMoeda } from '../utils/format'
import { EmployeeList } from './EmployeeList'

const funcionario = criarFuncionario(
  {
    nome: 'Ana Beatriz Souza',
    cpf: '529.982.247-25',
    salarioBruto: 2500,
    descontoPrevidencia: 220,
    dependentes: 0,
  },
  'ana',
)

const outroFuncionario = criarFuncionario(
  {
    nome: 'João Pedro Martins',
    cpf: '111.444.777-35',
    salarioBruto: 1800,
    descontoPrevidencia: 150,
    dependentes: 0,
  },
  'joao',
)

describe('EmployeeList', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('mostra o estado vazio quando não há funcionários', () => {
    renderWithStore(<EmployeeList onEditar={jest.fn()} />, {
      preloadedState: estadoEmployees(),
    })

    expect(
      screen.getByText('Nenhum funcionário encontrado para os filtros atuais.'),
    ).toBeInTheDocument()
  })

  it('lista os funcionários com valores formatados', () => {
    renderWithStore(<EmployeeList onEditar={jest.fn()} />, {
      preloadedState: estadoEmployees({ items: [funcionario] }),
    })

    const linha = screen.getByRole('row', { name: /Ana Beatriz Souza/ })

    expect(screen.getByText('1 funcionário(s) listado(s).')).toBeInTheDocument()
    expect(linha).toHaveTextContent('529.982.247-25')
    expect(linha).toHaveTextContent(formatarMoeda(2500).replace(/\s/g, ' '))
    expect(linha).toHaveTextContent(formatarMoeda(220).replace(/\s/g, ' '))
    expect(linha).toHaveTextContent(
      formatarMoeda(funcionario.descontoIRRF).replace(/\s/g, ' '),
    )
  })

  it('respeita o filtro de nome já persistido no store', () => {
    renderWithStore(<EmployeeList onEditar={jest.fn()} />, {
      preloadedState: estadoEmployees({
        items: [funcionario, outroFuncionario],
        filtroNome: 'João',
      }),
    })

    expect(screen.getByText('João Pedro Martins')).toBeInTheDocument()
    expect(screen.queryByText('Ana Beatriz Souza')).not.toBeInTheDocument()
  })

  it('chama onEditar e rola para o topo ao clicar em Editar', async () => {
    const onEditar = jest.fn()
    const scrollTo = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const user = userEvent.setup()

    renderWithStore(<EmployeeList onEditar={onEditar} />, {
      preloadedState: estadoEmployees({ items: [funcionario] }),
    })

    await user.click(screen.getByRole('button', { name: 'Editar' }))

    expect(onEditar).toHaveBeenCalledWith(funcionario)
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('exclui o funcionário quando a exclusão é confirmada', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true)
    const user = userEvent.setup()

    const { store } = renderWithStore(<EmployeeList onEditar={jest.fn()} />, {
      preloadedState: estadoEmployees({ items: [funcionario] }),
    })

    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(window.confirm).toHaveBeenCalled()
    expect(store.getState().employees.items).toHaveLength(0)
    expect(screen.queryByText('Ana Beatriz Souza')).not.toBeInTheDocument()
  })

  it('mantém o funcionário quando a exclusão é cancelada', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()

    const { store } = renderWithStore(<EmployeeList onEditar={jest.fn()} />, {
      preloadedState: estadoEmployees({ items: [funcionario] }),
    })

    await user.click(screen.getByRole('button', { name: 'Excluir' }))

    expect(store.getState().employees.items).toHaveLength(1)
    expect(screen.getByText('Ana Beatriz Souza')).toBeInTheDocument()
  })
})
