import { setFiltroCpf, setFiltroNome } from '../store/employeesSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { mascararCpf } from '../utils/cpf'

export function EmployeeFilter() {
  const dispatch = useAppDispatch()
  const filtroNome = useAppSelector((state) => state.employees.filtroNome)
  const filtroCpf = useAppSelector((state) => state.employees.filtroCpf)

  return (
    <section className="card filter-card" aria-label="Filtros da listagem">
      <div className="card-header">
        <h2>Filtrar funcionários</h2>
        <p>Busque por nome e/ou CPF na lista cadastrada.</p>
      </div>

      <div className="form-grid">
        <label className="field">
          Filtrar por nome
          <input
            name="filtroNome"
            value={filtroNome}
            onChange={(event) => dispatch(setFiltroNome(event.target.value))}
            placeholder="Ex.: Ana"
          />
        </label>

        <label className="field">
          Filtrar por CPF
          <input
            name="filtroCpf"
            value={filtroCpf}
            onChange={(event) => dispatch(setFiltroCpf(mascararCpf(event.target.value)))}
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
        </label>
      </div>
    </section>
  )
}
