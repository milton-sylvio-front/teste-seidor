import { configureStore } from '@reduxjs/toolkit'
import { employeesReducer } from './employeesSlice'

export function criarStore(preloadedState?: { employees: ReturnType<typeof employeesReducer> }) {
  return configureStore({
    reducer: {
      employees: employeesReducer,
    },
    preloadedState,
  })
}

export const store = criarStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
