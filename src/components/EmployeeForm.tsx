import { type FormEvent, useEffect, useState } from 'react'
import { addEmployee, cpfJaCadastrado, updateEmployee } from '../store/employeesSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { Employee, EmployeeFormValues } from '../types/employee'
import { cpfValido, mascararCpf } from '../utils/cpf'
import { parseNumero } from '../utils/format'

const FORMULARIO_VAZIO: EmployeeFormValues = {
  nome: '',
  cpf: '',
  salarioBruto: '',
  descontoPrevidencia: '',
  dependentes: '0',
}

type EmployeeFormProps = {
  funcionarioEmEdicao: Employee | null
  onCancelarEdicao: () => void
}

type FormErrors = Partial<Record<keyof EmployeeFormValues, string>>

function preencherFormulario(funcionario: Employee): EmployeeFormValues {
  return {
    nome: funcionario.nome,
    cpf: funcionario.cpf,
    salarioBruto: String(funcionario.salarioBruto),
    descontoPrevidencia: String(funcionario.descontoPrevidencia),
    dependentes: String(funcionario.dependentes),
  }
}

export function EmployeeForm({
  funcionarioEmEdicao,
  onCancelarEdicao,
}: EmployeeFormProps) {
  const dispatch = useAppDispatch()
  const funcionarios = useAppSelector((state) => state.employees.items)
  const [valores, setValores] = useState<EmployeeFormValues>(FORMULARIO_VAZIO)
  const [erros, setErros] = useState<FormErrors>({})

  useEffect(() => {
    if (funcionarioEmEdicao) {
      setValores(preencherFormulario(funcionarioEmEdicao))
      setErros({})
      return
    }

    setValores(FORMULARIO_VAZIO)
    setErros({})
  }, [funcionarioEmEdicao])

  function validar(): FormErrors {
    const novosErros: FormErrors = {}
    const salarioBruto = parseNumero(valores.salarioBruto)
    const descontoPrevidencia = parseNumero(valores.descontoPrevidencia)
    const dependentes = parseNumero(valores.dependentes)

    if (!valores.nome.trim()) {
      novosErros.nome = 'Informe o nome do funcionário.'
    }

    if (!cpfValido(valores.cpf)) {
      novosErros.cpf = 'Informe um CPF válido.'
    } else if (cpfJaCadastrado(funcionarios, valores.cpf, funcionarioEmEdicao?.id)) {
      novosErros.cpf = 'Já existe um funcionário com este CPF.'
    }

    if (salarioBruto === null || salarioBruto <= 0) {
      novosErros.salarioBruto = 'Informe um salário bruto maior que zero.'
    }

    if (descontoPrevidencia === null || descontoPrevidencia < 0) {
      novosErros.descontoPrevidencia = 'Informe um desconto da previdência válido.'
    } else if (salarioBruto !== null && descontoPrevidencia > salarioBruto) {
      novosErros.descontoPrevidencia = 'O desconto não pode ser maior que o salário bruto.'
    }

    if (
      dependentes === null ||
      dependentes < 0 ||
      !Number.isInteger(dependentes)
    ) {
      novosErros.dependentes = 'Informe um número inteiro de dependentes.'
    }

    return novosErros
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const novosErros = validar()
    setErros(novosErros)

    if (Object.keys(novosErros).length > 0) {
      return
    }

    const payload = {
      nome: valores.nome.trim(),
      cpf: mascararCpf(valores.cpf),
      salarioBruto: parseNumero(valores.salarioBruto) as number,
      descontoPrevidencia: parseNumero(valores.descontoPrevidencia) as number,
      dependentes: parseNumero(valores.dependentes) as number,
    }

    if (funcionarioEmEdicao) {
      dispatch(updateEmployee({ id: funcionarioEmEdicao.id, data: payload }))
      onCancelarEdicao()
    } else {
      dispatch(addEmployee(payload))
    }

    setValores(FORMULARIO_VAZIO)
  }

  const editando = Boolean(funcionarioEmEdicao)

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <div className="card-header">
        <h2>{editando ? 'Atualizar funcionário' : 'Cadastrar funcionário'}</h2>
        <p>Os descontos de IRRF são calculados automaticamente ao salvar.</p>
      </div>

      <div className="form-grid">
        <label className="field">
          Nome
          <input
            name="nome"
            value={valores.nome}
            onChange={(event) => setValores({ ...valores, nome: event.target.value })}
            aria-invalid={Boolean(erros.nome)}
            autoComplete="name"
          />
          {erros.nome ? <span className="field-error">{erros.nome}</span> : null}
        </label>

        <label className="field">
          CPF
          <input
            name="cpf"
            value={valores.cpf}
            onChange={(event) =>
              setValores({ ...valores, cpf: mascararCpf(event.target.value) })
            }
            inputMode="numeric"
            placeholder="000.000.000-00"
            aria-invalid={Boolean(erros.cpf)}
          />
          {erros.cpf ? <span className="field-error">{erros.cpf}</span> : null}
        </label>

        <label className="field">
          Salário bruto
          <input
            name="salarioBruto"
            value={valores.salarioBruto}
            onChange={(event) =>
              setValores({ ...valores, salarioBruto: event.target.value })
            }
            inputMode="decimal"
            placeholder="0,00"
            aria-invalid={Boolean(erros.salarioBruto)}
          />
          {erros.salarioBruto ? (
            <span className="field-error">{erros.salarioBruto}</span>
          ) : null}
        </label>

        <label className="field">
          Desconto da previdência
          <input
            name="descontoPrevidencia"
            value={valores.descontoPrevidencia}
            onChange={(event) =>
              setValores({ ...valores, descontoPrevidencia: event.target.value })
            }
            inputMode="decimal"
            placeholder="0,00"
            aria-invalid={Boolean(erros.descontoPrevidencia)}
          />
          {erros.descontoPrevidencia ? (
            <span className="field-error">{erros.descontoPrevidencia}</span>
          ) : null}
        </label>

        <label className="field">
          Número de dependentes
          <input
            name="dependentes"
            value={valores.dependentes}
            onChange={(event) =>
              setValores({ ...valores, dependentes: event.target.value })
            }
            inputMode="numeric"
            aria-invalid={Boolean(erros.dependentes)}
          />
          {erros.dependentes ? (
            <span className="field-error">{erros.dependentes}</span>
          ) : null}
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editando ? 'Salvar alterações' : 'Cadastrar'}
        </button>
        {editando ? (
          <button type="button" className="btn-secondary" onClick={onCancelarEdicao}>
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  )
}
