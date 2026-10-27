import { useState } from 'react'
import { EmployeeFilter } from './components/EmployeeFilter'
import { EmployeeForm } from './components/EmployeeForm'
import { EmployeeList } from './components/EmployeeList'
import type { Employee } from './types/employee'

function App() {
  const [funcionarioEmEdicao, setFuncionarioEmEdicao] = useState<Employee | null>(
    null,
  )

  return (
    <div className="app">
      <header className="hero-header">
        <p className="eyebrow">Folha de pagamento</p>
        <h1>Gestão de funcionários e IRRF</h1>
        <p>
          Cadastre, atualize e consulte funcionários. O salário-base e o desconto
          de IRRF são calculados automaticamente conforme a tabela progressiva.
        </p>
      </header>

      <EmployeeForm
        funcionarioEmEdicao={funcionarioEmEdicao}
        onCancelarEdicao={() => setFuncionarioEmEdicao(null)}
      />
      <EmployeeFilter />
      <EmployeeList onEditar={setFuncionarioEmEdicao} />
    </div>
  )
}

export default App
