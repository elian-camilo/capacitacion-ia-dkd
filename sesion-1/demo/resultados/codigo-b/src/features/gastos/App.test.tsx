import { afterEach, expect, it } from 'vitest'
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
