import { describe, expect, it } from 'vitest'
import { crearXlsx } from './xlsx'

// Lector mínimo del directorio central del ZIP: nombre -> contenido (sin comprimir)
function leerZip(zip: Uint8Array): Record<string, string> {
  const v = new DataView(zip.buffer, zip.byteOffset, zip.byteLength)
  const n = v.getUint16(zip.length - 22 + 10, true)
  let p = v.getUint32(zip.length - 22 + 16, true)
  const salida: Record<string, string> = {}
  for (let i = 0; i < n; i++) {
    const tam = v.getUint32(p + 24, true), nom = v.getUint16(p + 28, true), desp = v.getUint32(p + 42, true)
    const nombre = new TextDecoder().decode(zip.subarray(p + 46, p + 46 + nom))
    const ini = desp + 30 + v.getUint16(desp + 26, true) + v.getUint16(desp + 28, true)
    salida[nombre] = new TextDecoder().decode(zip.subarray(ini, ini + tam))
    p += 46 + nom
  }
  return salida
}

describe('crearXlsx', () => {
  const archivos = leerZip(crearXlsx([
    { nombre: 'Gastos', filas: [['Fecha', 'Valor'], ['2026-10-05', 150000]] },
    { nombre: 'Totales', filas: [['Total del mes', 0]] },
  ]))

  it('crea un ZIP con las partes de un libro de Excel y XML bien formado', () => {
    for (const parte of ['[Content_Types].xml', '_rels/.rels', 'xl/workbook.xml', 'xl/_rels/workbook.xml.rels', 'xl/worksheets/sheet1.xml', 'xl/worksheets/sheet2.xml']) {
      const doc = new DOMParser().parseFromString(archivos[parte], 'application/xml')
      expect(doc.querySelector('parsererror'), parte).toBeNull()
    }
  })

  it('nombra las hojas "Gastos" y "Totales"', () => {
    expect(archivos['xl/workbook.xml']).toContain('name="Gastos"')
    expect(archivos['xl/workbook.xml']).toContain('name="Totales"')
  })

  it('guarda los valores como números y los textos como texto', () => {
    expect(archivos['xl/worksheets/sheet1.xml']).toContain('<c r="B2"><v>150000</v></c>')
    expect(archivos['xl/worksheets/sheet1.xml']).toContain('<c r="A2" t="inlineStr"><is><t>2026-10-05</t></is></c>')
  })

  it('escapa caracteres especiales de XML', () => {
    const f = leerZip(crearXlsx([{ nombre: 'H', filas: [['A & <B>']] }]))
    expect(f['xl/worksheets/sheet1.xml']).toContain('A &amp; &lt;B&gt;')
  })
})
