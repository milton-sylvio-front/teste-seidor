import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { criarFuncionario } from './domain/irrf'
import { renderWithStore } from './test/renderWithStore'
import { formatarMoeda } from './utils/format'

const funcionarioBase = criarFuncionario(
  {
    nome: 'Ana Beatriz Souza',
    cpf: '529.982.247-25',
    salarioBruto: 2500,
    descontoPrevidencia: 220,
    dependentes: 0,
  },
  'ana',
)

describe('gestão de funcionários', () => {
  it('lista funcionários persistidos no Redux', () => {
    renderWithStore(<App />, {
      preloadedState: {
        employees: {
          items: [funcionarioBase],
          filtroNome: '',
          filtroCpf: '',
        },
      },
    })

    expect(screen.getByText('Ana Beatriz Souza')).toBeInTheDocument()
    expect(screen.getByText('529.982.247-25')).toBeInTheDocument()
  })

  it('cadastra um novo funcionário e exibe o IRRF calculado', async () => {
    const user = userEvent.setup()

    renderWithStore(<App />, {
      preloadedState: {
        employees: {
          items: [],
          filtroNome: '',
          filtroCpf: '',
        },
      },
    })

    await user.type(screen.getByLabelText('Nome'), 'Carlos Eduardo Lima')
    await user.type(screen.getByLabelText('CPF'), '39053344705')
    await user.type(screen.getByLabelText('Salário bruto'), '3200')
    await user.type(screen.getByLabelText('Desconto da previdência'), '320')
    await user.clear(screen.getByLabelText('Número de dependentes'))
    await user.type(screen.getByLabelText('Número de dependentes'), '1')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    const linha = screen.getByRole('row', { name: /Carlos Eduardo Lima/ })

    expect(linha).toHaveTextContent('390.533.447-05')
    expect(linha).toHaveTextContent(formatarMoeda(32.34).replace(/\s/g, ' '))
  })

  it('filtra a lista por nome e CPF', async () => {
    const user = userEvent.setup()
    const segundo = criarFuncionario(
      {
        nome: 'João Pedro Martins',
        cpf: '111.444.777-35',
        salarioBruto: 1800,
        descontoPrevidencia: 150,
        dependentes: 0,
      },
      'joao',
    )

    renderWithStore(<App />, {
      preloadedState: {
        employees: {
          items: [funcionarioBase, segundo],
          filtroNome: '',
          filtroCpf: '',
        },
      },
    })

    const filtros = screen.getByLabelText('Filtros da listagem')
    await user.type(within(filtros).getByLabelText('Filtrar por nome'), 'João')

    expect(screen.getByText('João Pedro Martins')).toBeInTheDocument()
    expect(screen.queryByText('Ana Beatriz Souza')).not.toBeInTheDocument()

    await user.clear(within(filtros).getByLabelText('Filtrar por nome'))
    await user.type(within(filtros).getByLabelText('Filtrar por CPF'), '52998224725')

    expect(screen.getByText('Ana Beatriz Souza')).toBeInTheDocument()
    expect(screen.queryByText('João Pedro Martins')).not.toBeInTheDocument()
  })

  it('atualiza e exclui um funcionário cadastrado', async () => {
    const user = userEvent.setup()
    jest.spyOn(window, 'confirm').mockReturnValue(true)

    renderWithStore(<App />, {
      preloadedState: {
        employees: {
          items: [funcionarioBase],
          filtroNome: '',
          filtroCpf: '',
        },
      },
    })

    await user.click(screen.getByRole('button', { name: 'Editar' }))
    await user.clear(screen.getByLabelText('Nome'))
    await user.type(screen.getByLabelText('Nome'), 'Ana Souza Atualizada')
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(screen.getByText('Ana Souza Atualizada')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(screen.queryByText('Ana Souza Atualizada')).not.toBeInTheDocument()
  })
})
