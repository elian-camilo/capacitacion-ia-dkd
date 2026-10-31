import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

afterEach(() => { cleanup(); localStorage.clear() })
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

it('exporta los gastos del mes con el nombre y tipo correctos', async () => {
  const user = userEvent.setup()
  URL.createObjectURL = vi.fn(() => 'blob:x'); URL.revokeObjectURL = vi.fn()
  const clic = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) { descargado = this.download })
  let descargado = ''
  render(<App />)
  await user.type(screen.getByLabelText('Descripción'), 'Resmas de papel')
  await user.selectOptions(screen.getByLabelText('Categoría'), 'Oficina')
  await user.type(screen.getByLabelText('Valor'), '25000')
  await user.click(screen.getByRole('button', { name: /guardar gasto/i }))
  expect(screen.getByText(/Total del mes: .*25\.000/)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /exportar gastos del mes/i }))
  expect(descargado).toMatch(/^gastos-\d{4}-\d{2}-\d{2}_\d{2}-\d{2}\.xlsx$/)
  clic.mockRestore()
})
