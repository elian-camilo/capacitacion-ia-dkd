export type Gasto = { id: string; fecha: string; descripcion: string; categoria: string; valor: number; comprobante?: string }

export function validarGasto(gasto: Omit<Gasto, 'id'>): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(gasto.fecha) && gasto.descripcion.trim().length > 0 && gasto.categoria.trim().length > 0 && Number.isSafeInteger(gasto.valor) && gasto.valor > 0 && (gasto.comprobante === undefined || typeof gasto.comprobante === 'string')
}

export function resumirCategorias(gastos: Pick<Gasto, 'categoria' | 'valor'>[]): [string, number][] {
  const totales = new Map<string, number>()
  for (const gasto of gastos) totales.set(gasto.categoria, (totales.get(gasto.categoria) ?? 0) + gasto.valor)
  return [...totales.entries()]
}

export const formatoPeso = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
