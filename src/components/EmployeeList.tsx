import { removeEmployee, selectEmployeesFiltrados } from '../store/employeesSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import type { Employee } from '../types/employee'
import { formatarMoeda } from '../utils/format'

type EmployeeListProps = {
  onEditar: (funcionario: Employee) => void
}

export function EmployeeList({ onEditar }: EmployeeListProps) {
  const dispatch = useAppDispatch()
  const funcionarios = useAppSelector((state) =>
    selectEmployeesFiltrados(state.employees),
  )

  function handleEditar(funcionario: Employee) {
    onEditar(funcionario)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleExcluir(funcionario: Employee) {
    const confirmar = window.confirm(
      `Excluir o funcionário ${funcionario.nome}? Esta ação não pode ser desfeita.`,
    )

    if (confirmar) {
      dispatch(removeEmployee(funcionario.id))
    }
  }

  return (
    <section className="card table-card">
      <div className="card-header">
        <h2>Funcionários cadastrados</h2>
        <p>
          {funcionarios.length === 0
            ? 'Nenhum funcionário encontrado para os filtros atuais.'
            : `${funcionarios.length} funcionário(s) listado(s).`}
        </p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Salário</th>
              <th>Desconto</th>
              <th>Dependentes</th>
              <th>Desconto IRPF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map((funcionario) => (
              <tr key={funcionario.id}>
                <td>{funcionario.nome}</td>
                <td>{funcionario.cpf}</td>
                <td>{formatarMoeda(funcionario.salarioBruto)}</td>
                <td>{formatarMoeda(funcionario.descontoPrevidencia)}</td>
                <td>{funcionario.dependentes}</td>
                <td>{formatarMoeda(funcionario.descontoIRRF)}</td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => handleEditar(funcionario)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn-link danger"
                      onClick={() => handleExcluir(funcionario)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
