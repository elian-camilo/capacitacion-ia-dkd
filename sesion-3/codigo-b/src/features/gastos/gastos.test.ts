import { describe, expect, it } from 'vitest'
import { resumirCategorias, validarGasto } from './gastos'

describe('gastos', () => {
  it('suma los valores por categoría', () => {
    expect(resumirCategorias([{ categoria: 'Oficina', valor: 1000 }, { categoria: 'Transporte', valor: 3000 }, { categoria: 'Oficina', valor: 2500 }])).toEqual([['Oficina', 3500], ['Transporte', 3000]])
  })
  it('exige fecha, descripción, categoría y un valor entero positivo', () => {
    expect(validarGasto({ fecha: '2026-01-02', descripcion: ' Papel ', categoria: 'Oficina', valor: 2000 })).toBe(true)
    expect(validarGasto({ fecha: '', descripcion: ' ', categoria: '', valor: -1 })).toBe(false)
    expect(validarGasto({ fecha: '2026-01-02', descripcion: 'Papel', categoria: 'Oficina', valor: 1.5 })).toBe(false)
  })
})
