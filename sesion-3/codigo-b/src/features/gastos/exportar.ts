import type { Gasto } from './gastos'
import { resumirCategorias } from './gastos'

const SIN_CATEGORIA = 'Sin categoría'

function partesColombia(ahora: Date) {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(ahora)
  return Object.fromEntries(partes.map((p) => [p.type, p.value])) as Record<'year' | 'month' | 'day' | 'hour' | 'minute', string>
}

export function gastosDelMes(gastos: Gasto[], ahora: Date): Gasto[] {
  const { year, month } = partesColombia(ahora)
  return gastos.filter((gasto) => gasto.fecha.startsWith(`${year}-${month}-`))
}

export function nombreArchivo(ahora: Date): string {
  const { year, month, day, hour, minute } = partesColombia(ahora)
  return `gastos-${year}-${month}-${day}_${hour}-${minute}.xlsx`
}

const categoriaDe = (gasto: Pick<Gasto, 'categoria'>) => gasto.categoria.trim() || SIN_CATEGORIA

export function filasGastos(gastos: Gasto[]): (string | number)[][] {
  return [
    ['Fecha', 'Descripción', 'Valor', 'Categoría', 'Comprobante'],
    ...gastos.map((g) => [g.fecha, g.descripcion, g.valor, categoriaDe(g), g.comprobante?.trim() || 'N/A']),
  ]
}

export function totalesDelMes(gastos: Gasto[]): { total: number; subtotales: [string, number][] } {
  return {
    total: gastos.reduce((suma, gasto) => suma + gasto.valor, 0),
    subtotales: resumirCategorias(gastos.map((g) => ({ categoria: categoriaDe(g), valor: g.valor }))),
  }
}

export function hojasDelMes(gastos: Gasto[], ahora: Date) {
  const delMes = gastosDelMes(gastos, ahora)
  const { total, subtotales } = totalesDelMes(delMes)
  return [
    { nombre: 'Gastos', filas: filasGastos(delMes) },
    { nombre: 'Totales', filas: [['Total del mes', total], ...subtotales.map(([cat, valor]) => [`Subtotal ${cat}`, valor])] },
  ]
}
