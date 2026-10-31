import { resumirCategorias, type Gasto } from './gastos'

export type Celda = string | number

const SIN_CATEGORIA = 'Sin categoría'

// Fecha y hora de Colombia, sin depender de la zona del navegador.
function ahoraEnBogota(ahora: Date) {
  const partes = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(ahora)
  const p = Object.fromEntries(partes.map(({ type, value }) => [type, value]))
  return { mes: `${p.year}-${p.month}`, dia: `${p.year}-${p.month}-${p.day}`, hora: `${p.hour}-${p.minute}` }
}

export function gastosDelMes(gastos: Gasto[], ahora: Date): Gasto[] {
  const { mes } = ahoraEnBogota(ahora)
  return gastos.filter((gasto) => gasto.fecha.startsWith(mes))
}

export const totalDelMes = (gastos: Gasto[], ahora: Date) => gastosDelMes(gastos, ahora).reduce((suma, gasto) => suma + gasto.valor, 0)

export function nombreArchivo(ahora: Date): string {
  const { dia, hora } = ahoraEnBogota(ahora)
  return `contabilidad_${dia}_${hora}.xlsx`
}

export function filasExportacion(gastos: Gasto[], ahora: Date): Celda[][] {
  const delMes = gastosDelMes(gastos, ahora).sort((a, b) => a.fecha.localeCompare(b.fecha))
  const porCategoria = resumirCategorias(delMes.map(({ categoria, valor }) => ({ categoria: categoria.trim() || SIN_CATEGORIA, valor })))
  const lineas = [...porCategoria.filter(([nombre]) => nombre !== SIN_CATEGORIA), ...porCategoria.filter(([nombre]) => nombre === SIN_CATEGORIA)]
  return [
    ['Fecha', 'Valor', 'Concepto', 'Categoría', 'Comprobante'],
    ...delMes.map((gasto): Celda[] => [gasto.fecha, gasto.valor, gasto.descripcion, gasto.categoria, gasto.comprobante ?? '']),
    [],
    ...lineas.map(([nombre, valor]): Celda[] => ['', valor, '', nombre, '']),
    ['', delMes.reduce((suma, gasto) => suma + gasto.valor, 0), '', 'Total del mes', ''],
  ]
}
