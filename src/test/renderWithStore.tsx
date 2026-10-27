import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import type { ReactElement, ReactNode } from 'react'
import { criarStore, type RootState } from '../store/store'

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
