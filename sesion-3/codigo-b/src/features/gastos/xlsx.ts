export type Celda = string | number
export type Hoja = { nombre: string; filas: Celda[][] }

const texto = new TextEncoder()
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

const tablaCrc = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0 })
const crc32 = (d: Uint8Array) => { let c = 0xffffffff; for (const b of d) c = tablaCrc[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }

// ponytail: números como <v> y textos inline; sin estilos ni sharedStrings.
function xmlHoja({ filas }: Hoja): string {
  const filasXml = filas.map((fila, i) => `<row r="${i + 1}">${fila.map((celda, j) => {
    const ref = String.fromCharCode(65 + j) + (i + 1)
    return typeof celda === 'number' ? `<c r="${ref}"><v>${celda}</v></c>` : `<c r="${ref}" t="inlineStr"><is><t>${esc(celda)}</t></is></c>`
  }).join('')}</row>`).join('')
  return `${XML}<worksheet xmlns="${NS}"><sheetData>${filasXml}</sheetData></worksheet>`
}

// ZIP sin compresión (método 0): suficiente para un .xlsx y no necesita librerías.
function zip(archivos: [string, string][]): Uint8Array<ArrayBuffer> {
  const partes: Uint8Array[] = [], central: Uint8Array[] = []
  let desplazamiento = 0
  for (const [nombre, contenido] of archivos) {
    const n = texto.encode(nombre), d = texto.encode(contenido), crc = crc32(d)
    const local = new DataView(new ArrayBuffer(30))
    ;[[0, 0x04034b50, 4], [4, 20, 2], [6, 0x0800, 2], [10, 0, 2], [12, 33, 2], [14, crc, 4], [18, d.length, 4], [22, d.length, 4], [26, n.length, 2]]
      .forEach(([o, v, t]) => (t === 4 ? local.setUint32(o, v, true) : local.setUint16(o, v, true)))
    const cd = new DataView(new ArrayBuffer(46))
    ;[[0, 0x02014b50, 4], [4, 20, 2], [6, 20, 2], [8, 0x0800, 2], [12, 0, 2], [14, 33, 2], [16, crc, 4], [20, d.length, 4], [24, d.length, 4], [28, n.length, 2], [42, desplazamiento, 4]]
      .forEach(([o, v, t]) => (t === 4 ? cd.setUint32(o, v, true) : cd.setUint16(o, v, true)))
    partes.push(new Uint8Array(local.buffer), n, d)
    central.push(new Uint8Array(cd.buffer), n)
    desplazamiento += 30 + n.length + d.length
  }
  const tamCentral = central.reduce((s, p) => s + p.length, 0)
  const fin = new DataView(new ArrayBuffer(22))
  fin.setUint32(0, 0x06054b50, true); fin.setUint16(8, archivos.length, true); fin.setUint16(10, archivos.length, true)
  fin.setUint32(12, tamCentral, true); fin.setUint32(16, desplazamiento, true)
  const todo = [...partes, ...central, new Uint8Array(fin.buffer)]
  const salida = new Uint8Array(todo.reduce((s, p) => s + p.length, 0))
  let pos = 0
  for (const p of todo) { salida.set(p, pos); pos += p.length }
  return salida
}

export function crearXlsx(hojas: Hoja[]): Uint8Array<ArrayBuffer> {
  const rel = (i: number, tipo: string, destino: string) => `<Relationship Id="rId${i}" Type="${REL}/${tipo}" Target="${destino}"/>`
  return zip([
    ['[Content_Types].xml', `${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${hojas.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`],
    ['_rels/.rels', `${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rel(1, 'officeDocument', 'xl/workbook.xml')}</Relationships>`],
    ['xl/workbook.xml', `${XML}<workbook xmlns="${NS}" xmlns:r="${REL}"><sheets>${hojas.map((h, i) => `<sheet name="${esc(h.nombre)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`],
    ['xl/_rels/workbook.xml.rels', `${XML}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${hojas.map((_, i) => rel(i + 1, 'worksheet', `worksheets/sheet${i + 1}.xml`)).join('')}</Relationships>`],
    ...hojas.map((h, i): [string, string] => [`xl/worksheets/sheet${i + 1}.xml`, xmlHoja(h)]),
  ])
}
