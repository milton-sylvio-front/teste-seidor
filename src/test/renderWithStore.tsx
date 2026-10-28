import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import type { ReactElement, ReactNode } from 'react'
import type { Employee } from '../types/employee'
import { criarStore, type RootState } from '../store/store'

export function estadoEmployees(
  overrides: Partial<RootState['employees']> = {},
): RootState {
  return {
    employees: {
      items: [] as Employee[],
      filtroNome: '',
      filtroCpf: '',
      ...overrides,
    },
  }
}

export function renderWithStore(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    preloadedState?: RootState
  },
) {
  const store = criarStore(options?.preloadedState)

  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...options }),
  }
}
