import { describe, expect, it } from 'vitest'
import { filasGastos, gastosDelMes, nombreArchivo, totalesDelMes } from './exportar'
import type { Gasto } from './gastos'

const g = (fecha: string, valor: number, categoria = 'Oficina', comprobante?: string): Gasto =>
  ({ id: fecha + valor, fecha, descripcion: 'Papel', categoria, valor, comprobante })
const ahora = new Date('2026-10-31T15:00:00-05:00')

describe('exportar', () => {
  it('incluye solo los gastos del mes actual por fecha del gasto', () => {
    const gastos = [g('2026-09-30', 1), g('2026-10-01', 2), g('2026-10-31', 3), g('2026-11-01', 4)]
    expect(gastosDelMes(gastos, ahora).map((x) => x.valor)).toEqual([2, 3])
  })

  it('usa el mes de Colombia aunque en UTC ya sea el mes siguiente', () => {
    const finDeMes = new Date('2026-10-31T23:30:00-05:00')
    expect(gastosDelMes([g('2026-10-31', 1), g('2026-11-01', 2)], finDeMes).map((x) => x.valor)).toEqual([1])
  })

  it('arma filas con fecha, descripción, valor numérico, categoría y comprobante, sin quién lo hizo', () => {
    const filas = filasGastos([g('2026-10-05', 150000, 'Oficina', 'FV-12'), g('2026-10-06', 2000, '')])
    expect(filas[0]).toEqual(['Fecha', 'Descripción', 'Valor', 'Categoría', 'Comprobante'])
    expect(filas[1]).toEqual(['2026-10-05', 'Papel', 150000, 'Oficina', 'FV-12'])
    expect(filas[2]).toEqual(['2026-10-06', 'Papel', 2000, 'Sin categoría', 'N/A'])
  })

  it('calcula el total y un subtotal por categoría, incluida "Sin categoría"', () => {
    const t = totalesDelMes([g('2026-10-01', 1000), g('2026-10-02', 500, ''), g('2026-10-03', 250)])
    expect(t.total).toBe(1750)
    expect(t.subtotales).toEqual([['Oficina', 1250], ['Sin categoría', 500]])
    expect(t.subtotales.reduce((s, [, v]) => s + v, 0)).toBe(t.total)
  })

  it('con un mes sin gastos deja solo encabezados y total 0', () => {
    expect(filasGastos([])).toHaveLength(1)
    expect(totalesDelMes([])).toEqual({ total: 0, subtotales: [] })
  })

  it('nombra el archivo con fecha y hora de Colombia', () => {
    expect(nombreArchivo(new Date('2026-10-31T23:05:00-05:00'))).toBe('gastos-2026-10-31_23-05.xlsx')
  })
})
