import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { criarFuncionario } from '../domain/irrf'
import { estadoEmployees, renderWithStore } from '../test/renderWithStore'
import { EmployeeForm } from './EmployeeForm'

const funcionarioExistente = criarFuncionario(
  {
    nome: 'Ana Beatriz Souza',
    cpf: '529.982.247-25',
    salarioBruto: 2500,
    descontoPrevidencia: 220,
    dependentes: 0,
  },
  'ana',
)

async function preencherCadastroValido() {
  const user = userEvent.setup()

  await user.type(screen.getByLabelText('Nome'), 'Carlos Eduardo Lima')
  await user.type(screen.getByLabelText('CPF'), '39053344705')
  await user.type(screen.getByLabelText('Salário bruto'), '3200')
  await user.type(screen.getByLabelText('Desconto da previdência'), '320')
  await user.clear(screen.getByLabelText('Número de dependentes'))
  await user.type(screen.getByLabelText('Número de dependentes'), '1')

  return user
}

describe('EmployeeForm', () => {
  it('renderiza o formulário de cadastro', () => {
    renderWithStore(
      <EmployeeForm funcionarioEmEdicao={null} onCancelarEdicao={jest.fn()} />,
      { preloadedState: estadoEmployees() },
    )

    expect(
      screen.getByRole('heading', { name: 'Cadastrar funcionário' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Cancelar' }),
    ).not.toBeInTheDocument()
  })

  it('exibe erros de validação ao enviar o formulário vazio', async () => {
    const user = userEvent.setup()

    renderWithStore(
      <EmployeeForm funcionarioEmEdicao={null} onCancelarEdicao={jest.fn()} />,
      { preloadedState: estadoEmployees() },
    )

    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(screen.getByText('Informe o nome do funcionário.')).toBeInTheDocument()
    expect(screen.getByText('Informe um CPF válido.')).toBeInTheDocument()
    expect(
      screen.getByText('Informe um salário bruto maior que zero.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Informe um desconto da previdência válido.'),
    ).toBeInTheDocument()
  })

  it('cadastra um funcionário válido no store', async () => {
    const { store } = renderWithStore(
      <EmployeeForm funcionarioEmEdicao={null} onCancelarEdicao={jest.fn()} />,
      { preloadedState: estadoEmployees() },
    )

    const user = await preencherCadastroValido()
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(store.getState().employees.items).toHaveLength(1)
    expect(store.getState().employees.items[0]).toMatchObject({
      nome: 'Carlos Eduardo Lima',
      cpf: '390.533.447-05',
      salarioBruto: 3200,
      descontoPrevidencia: 320,
      dependentes: 1,
    })
    expect(screen.getByLabelText('Nome')).toHaveValue('')
  })

  it('impede cadastro com CPF já existente', async () => {
    const user = userEvent.setup()

    renderWithStore(
      <EmployeeForm funcionarioEmEdicao={null} onCancelarEdicao={jest.fn()} />,
      {
        preloadedState: estadoEmployees({
          items: [funcionarioExistente],
        }),
      },
    )

    await user.type(screen.getByLabelText('Nome'), 'Outra Pessoa')
    await user.type(screen.getByLabelText('CPF'), '52998224725')
    await user.type(screen.getByLabelText('Salário bruto'), '2000')
    await user.type(screen.getByLabelText('Desconto da previdência'), '100')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(
      screen.getByText('Já existe um funcionário com este CPF.'),
    ).toBeInTheDocument()
  })

  it('rejeita desconto da previdência maior que o salário', async () => {
    const user = userEvent.setup()

    renderWithStore(
      <EmployeeForm funcionarioEmEdicao={null} onCancelarEdicao={jest.fn()} />,
      { preloadedState: estadoEmployees() },
    )

    await user.type(screen.getByLabelText('Nome'), 'Carlos Eduardo Lima')
    await user.type(screen.getByLabelText('CPF'), '39053344705')
    await user.type(screen.getByLabelText('Salário bruto'), '1000')
    await user.type(screen.getByLabelText('Desconto da previdência'), '1500')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(
      screen.getByText('O desconto não pode ser maior que o salário bruto.'),
    ).toBeInTheDocument()
  })

  it('preenche os campos e salva alterações na edição', async () => {
    const onCancelarEdicao = jest.fn()
    const user = userEvent.setup()

    const { store } = renderWithStore(
      <EmployeeForm
        funcionarioEmEdicao={funcionarioExistente}
        onCancelarEdicao={onCancelarEdicao}
      />,
      {
        preloadedState: estadoEmployees({
          items: [funcionarioExistente],
        }),
      },
    )

    expect(
      screen.getByRole('heading', { name: 'Atualizar funcionário' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana Beatriz Souza')
    expect(screen.getByLabelText('CPF')).toHaveValue('529.982.247-25')

    await user.clear(screen.getByLabelText('Nome'))
    await user.type(screen.getByLabelText('Nome'), 'Ana Souza Atualizada')
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(store.getState().employees.items[0].nome).toBe('Ana Souza Atualizada')
    expect(onCancelarEdicao).toHaveBeenCalledTimes(1)
  })

  it('cancela a edição sem persistir alterações', async () => {
    const onCancelarEdicao = jest.fn()
    const user = userEvent.setup()

    renderWithStore(
      <EmployeeForm
        funcionarioEmEdicao={funcionarioExistente}
        onCancelarEdicao={onCancelarEdicao}
      />,
      {
        preloadedState: estadoEmployees({
          items: [funcionarioExistente],
        }),
      },
    )

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onCancelarEdicao).toHaveBeenCalledTimes(1)
  })
})
