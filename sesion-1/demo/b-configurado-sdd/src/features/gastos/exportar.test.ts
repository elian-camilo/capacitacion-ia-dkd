import { describe, expect, it } from 'vitest'
import type { Gasto } from './gastos'
import { filasExportacion, gastosDelMes, nombreArchivo, totalDelMes } from './exportar'

const gasto = (fecha: string, categoria: string, valor: number, comprobante?: string): Gasto => ({ id: fecha + categoria, fecha, descripcion: `Concepto ${fecha}`, categoria, valor, comprobante })
const ahora = new Date('2026-10-31T15:30:00-05:00')

describe('exportar', () => {
  it('toma solo los gastos del mes actual según la fecha del gasto', () => {
    const fechas = ['2026-09-30', '2026-10-01', '2026-10-31', '2026-11-01'].map((fecha) => gasto(fecha, 'Oficina', 1000))
    expect(gastosDelMes(fechas, ahora).map((g) => g.fecha)).toEqual(['2026-10-01', '2026-10-31'])
  })
  it('usa la fecha de Colombia: las 22:00 del 31 de octubre en Bogotá siguen siendo octubre', () => {
    const lasDiezDeLaNoche = new Date('2026-11-01T03:00:00Z')
    expect(gastosDelMes([gasto('2026-10-31', 'Oficina', 1000), gasto('2026-11-01', 'Oficina', 1000)], lasDiezDeLaNoche).map((g) => g.fecha)).toEqual(['2026-10-31'])
  })
  it('el total del mes suma solo los gastos del mes', () => {
    expect(totalDelMes([gasto('2026-10-02', 'Oficina', 1000), gasto('2026-10-03', 'Banco', 2500), gasto('2026-09-30', 'Oficina', 9999)], ahora)).toBe(3500)
  })
  it('nombra el archivo con la fecha y hora de Bogotá', () => {
    expect(nombreArchivo(new Date('2026-10-31T20:05:00Z'))).toBe('contabilidad_2026-10-31_15-05.xlsx')
    expect(nombreArchivo(new Date('2026-11-01T05:00:00Z'))).toBe('contabilidad_2026-11-01_00-00.xlsx')
  })
  it('arma filas por fecha, campos vacíos en blanco y totales al final', () => {
    const filas = filasExportacion([gasto('2026-10-20', 'Oficina', 1000), gasto('2026-10-05', 'Banco', 2500, 'F-1'), gasto('2026-10-10', '', 500), gasto('2026-09-30', 'Oficina', 9999)], ahora)
    expect(filas).toEqual([
      ['Fecha', 'Valor', 'Concepto', 'Categoría', 'Comprobante'],
      ['2026-10-05', 2500, 'Concepto 2026-10-05', 'Banco', 'F-1'],
      ['2026-10-10', 500, 'Concepto 2026-10-10', '', ''],
      ['2026-10-20', 1000, 'Concepto 2026-10-20', 'Oficina', ''],
      [],
      ['', 2500, '', 'Banco', ''],
      ['', 1000, '', 'Oficina', ''],
      ['', 500, '', 'Sin categoría', ''],
      ['', 4000, '', 'Total del mes', ''],
    ])
  })
  it('sin gastos sin categoría no agrega la línea "Sin categoría"', () => {
    const filas = filasExportacion([gasto('2026-10-05', 'Banco', 2500)], ahora)
    expect(filas.map((fila) => fila[3])).not.toContain('Sin categoría')
  })
})
