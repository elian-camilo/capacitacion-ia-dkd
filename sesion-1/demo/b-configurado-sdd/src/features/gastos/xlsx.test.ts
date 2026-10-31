import { describe, expect, it } from 'vitest'
import { construirXlsx, crc32 } from './xlsx'

// Lector mínimo del ZIP "stored": valida firmas y CRC de cada entrada.
function leerZip(zip: Uint8Array): Record<string, string> {
  const vista = new DataView(zip.buffer, zip.byteOffset, zip.byteLength)
  const fin = zip.length - 22
  expect(vista.getUint32(fin, true)).toBe(0x06054b50)
  const entradas = vista.getUint16(fin + 10, true)
  const decodificar = new TextDecoder()
  const archivos: Record<string, string> = {}
  let p = vista.getUint32(fin + 16, true)
  for (let i = 0; i < entradas; i++) {
    expect(vista.getUint32(p, true)).toBe(0x02014b50)
    const crc = vista.getUint32(p + 16, true)
    const tamaño = vista.getUint32(p + 20, true)
    const largoNombre = vista.getUint16(p + 28, true)
    const local = vista.getUint32(p + 42, true)
    const inicio = local + 30 + vista.getUint16(local + 26, true) + vista.getUint16(local + 28, true)
    const datos = zip.subarray(inicio, inicio + tamaño)
    expect(crc32(datos)).toBe(crc)
    archivos[decodificar.decode(zip.subarray(p + 46, p + 46 + largoNombre))] = decodificar.decode(datos)
    p += 46 + largoNombre
  }
  return archivos
}

describe('xlsx', () => {
  it('calcula el CRC32 estándar', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926)
  })
  it('crea un zip con las partes mínimas de un libro de Excel', () => {
    const archivos = leerZip(construirXlsx([['Fecha', 'Valor']]))
    expect(Object.keys(archivos).sort()).toEqual(['[Content_Types].xml', '_rels/.rels', 'xl/_rels/workbook.xml.rels', 'xl/workbook.xml', 'xl/worksheets/sheet1.xml'])
  })
  it('escribe números como celdas numéricas y el texto con tildes, ñ y XML escapado', () => {
    const hoja = leerZip(construirXlsx([['Fecha', 'Valor'], ['2026-10-05', 1500000], ['Tom & Jerry <ñ> Alimentación', '']]))['xl/worksheets/sheet1.xml']
    expect(hoja).toContain('<c r="B2"><v>1500000</v></c>')
    expect(hoja).toContain('<t xml:space="preserve">2026-10-05</t>')
    expect(hoja).toContain('Tom &amp; Jerry &lt;ñ&gt; Alimentación')
  })
  it('deja en blanco las celdas vacías y conserva las filas vacías', () => {
    const hoja = leerZip(construirXlsx([['a', 'b'], [], ['', 5]]))['xl/worksheets/sheet1.xml']
    expect(hoja).not.toContain('r="A3"')
    expect(hoja).toContain('<c r="B3"><v>5</v></c>')
    expect(hoja).toContain('<row r="2"/>')
  })
})
