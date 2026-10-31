import type { Celda } from './exportar'

// Escritor mínimo de .xlsx sin dependencias: un ZIP sin compresión con las partes que Excel exige.
// ponytail: sin estilos ni compresión; si hace falta formato (anchos, negritas) conviene una librería.
const texto = new TextEncoder()

const tabla = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

export function crc32(datos: Uint8Array): number {
  let c = 0xffffffff
  for (const byte of datos) c = tabla[(c ^ byte) & 255] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

type Campo = [valor: number, bytes: 2 | 4]
const enLittleEndian = (...campos: Campo[]) => Uint8Array.from(campos.flatMap(([valor, bytes]) => Array.from({ length: bytes }, (_, i) => (valor >>> (8 * i)) & 255)))
const unir = (partes: Uint8Array[]) => {
  const total = new Uint8Array(partes.reduce((suma, parte) => suma + parte.length, 0))
  let posicion = 0
  for (const parte of partes) { total.set(parte, posicion); posicion += parte.length }
  return total
}

const UTF8 = 0x0800
const FECHA_DOS = 33 // 1980-01-01, fecha mínima válida del formato ZIP

function comprimirSinCompresion(archivos: [nombre: string, contenido: string][]): Uint8Array<ArrayBuffer> {
  const locales: Uint8Array[] = []
  const centrales: Uint8Array[] = []
  let posicion = 0
  for (const [nombre, contenido] of archivos) {
    const nombreBytes = texto.encode(nombre)
    const datos = texto.encode(contenido)
    const crc = crc32(datos)
    const local = unir([enLittleEndian([0x04034b50, 4], [20, 2], [UTF8, 2], [0, 2], [0, 2], [FECHA_DOS, 2], [crc, 4], [datos.length, 4], [datos.length, 4], [nombreBytes.length, 2], [0, 2]), nombreBytes, datos])
    centrales.push(unir([enLittleEndian([0x02014b50, 4], [20, 2], [20, 2], [UTF8, 2], [0, 2], [0, 2], [FECHA_DOS, 2], [crc, 4], [datos.length, 4], [datos.length, 4], [nombreBytes.length, 2], [0, 2], [0, 2], [0, 2], [0, 2], [0, 4], [posicion, 4]), nombreBytes]))
    locales.push(local)
    posicion += local.length
  }
  const directorio = unir(centrales)
  const fin = enLittleEndian([0x06054b50, 4], [0, 2], [0, 2], [archivos.length, 2], [archivos.length, 2], [directorio.length, 4], [posicion, 4], [0, 2])
  return unir([...locales, directorio, fin])
}

const escapar = (valor: string) => valor.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const columna = (indice: number) => String.fromCharCode(65 + indice)

function hoja(filas: Celda[][]): string {
  const xml = filas.map((fila, i) => {
    const celdas = fila.map((celda, j) => {
      const ref = `${columna(j)}${i + 1}`
      if (typeof celda === 'number') return `<c r="${ref}"><v>${celda}</v></c>`
      return celda === '' ? '' : `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapar(celda)}</t></is></c>`
    }).join('')
    return celdas ? `<row r="${i + 1}">${celdas}</row>` : `<row r="${i + 1}"/>`
  }).join('')
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${xml}</sheetData></worksheet>`
}

const CABECERA = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

export function construirXlsx(filas: Celda[][]): Uint8Array<ArrayBuffer> {
  return comprimirSinCompresion([
    ['[Content_Types].xml', `${CABECERA}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`],
    ['_rels/.rels', `${CABECERA}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/officeDocument" Target="xl/workbook.xml"/></Relationships>`],
    ['xl/workbook.xml', `${CABECERA}<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="${REL}"><sheets><sheet name="Gastos" sheetId="1" r:id="rId1"/></sheets></workbook>`],
    ['xl/_rels/workbook.xml.rels', `${CABECERA}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`],
    ['xl/worksheets/sheet1.xml', hoja(filas)],
  ])
}
