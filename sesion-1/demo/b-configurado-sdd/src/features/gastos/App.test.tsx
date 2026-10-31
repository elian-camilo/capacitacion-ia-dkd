import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

afterEach(() => { cleanup(); localStorage.clear(); vi.useRealTimers(); vi.restoreAllMocks() })

const guardarGastos = (gastos: object[]) => localStorage.setItem('caja-menor:gastos:v1', JSON.stringify(gastos))
const octubre15 = () => vi.useFakeTimers({ toFake: ['Date'], now: new Date('2026-10-15T12:00:00-05:00') })
it('registra un gasto y conserva la lista al volver a abrir', async () => {
  const user = userEvent.setup()
  const view = render(<App />)
  await user.type(screen.getByLabelText('Descripción'), 'Resmas de papel')
  await user.selectOptions(screen.getByLabelText('Categoría'), 'Oficina')
  await user.type(screen.getByLabelText('Valor'), '25000')
  await user.click(screen.getByRole('button', { name: /guardar gasto/i }))
  expect(screen.getByText('Resmas de papel')).toBeInTheDocument()
  expect(screen.getAllByText(/25.000/).length).toBeGreaterThan(0)
  view.unmount()
  render(<App />)
  expect(screen.getByText('Resmas de papel')).toBeInTheDocument()
})
it('guarda el número de comprobante opcional y lo muestra en la lista', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.type(screen.getByLabelText('Descripción'), 'Resmas de papel')
  await user.selectOptions(screen.getByLabelText('Categoría'), 'Banco')
  await user.type(screen.getByLabelText('Valor'), '25000')
  await user.type(screen.getByLabelText('Número de comprobante'), 'F-123')
  await user.click(screen.getByRole('button', { name: /guardar gasto/i }))
  expect(screen.getByText('F-123')).toBeInTheDocument()
})
it('muestra el total del mes aparte, sin los gastos de otros meses', () => {
  octubre15()
  guardarGastos([
    { id: '1', fecha: '2026-10-02', descripcion: 'Papel', categoria: 'Oficina', valor: 25000 },
    { id: '2', fecha: '2026-09-30', descripcion: 'Taxi', categoria: 'Transporte', valor: 10000 },
  ])
  render(<App />)
  expect(screen.getByText(/Total del mes/)).toHaveTextContent(/25\.000/)
  expect(screen.getByText(/Total del mes/)).not.toHaveTextContent(/35\.000/)
})
it('sin gastos en el mes deshabilita exportar y avisa', () => {
  octubre15()
  guardarGastos([{ id: '2', fecha: '2026-09-30', descripcion: 'Taxi', categoria: 'Transporte', valor: 10000 }])
  render(<App />)
  expect(screen.getByRole('button', { name: /exportar gastos del mes/i })).toBeDisabled()
  expect(screen.getByText(/no hay gastos en el mes/i)).toBeInTheDocument()
})
it('con gastos en el mes descarga el archivo de contabilidad', async () => {
  octubre15()
  guardarGastos([{ id: '1', fecha: '2026-10-02', descripcion: 'Papel', categoria: 'Oficina', valor: 25000 }])
  URL.createObjectURL = vi.fn(() => 'blob:prueba')
  URL.revokeObjectURL = vi.fn()
  const descargas: string[] = []
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) { descargas.push(this.download) })
  render(<App />)
  const boton = screen.getByRole('button', { name: /exportar gastos del mes/i })
  expect(boton).toBeEnabled()
  expect(screen.queryByText(/no hay gastos en el mes/i)).not.toBeInTheDocument()
  await userEvent.setup().click(boton)
  expect(descargas).toEqual(['contabilidad_2026-10-15_12-00.xlsx'])
})
