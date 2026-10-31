import { useState, type FormEvent } from 'react'
import { formatoPeso, resumirCategorias, validarGasto, type Gasto } from './gastos'
import { filasExportacion, gastosDelMes, nombreArchivo, totalDelMes } from './exportar'
import { construirXlsx } from './xlsx'
import styles from './App.module.css'

const CLAVE = 'caja-menor:gastos:v1'
const categorias = ['Oficina', 'Transporte', 'Alimentación', 'Servicios', 'Banco', 'Otros']

function descargarExcel(gastos: Gasto[]) {
  const ahora = new Date()
  const archivo = new Blob([construirXlsx(filasExportacion(gastos, ahora))], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(archivo)
  enlace.download = nombreArchivo(ahora)
  enlace.click()
  URL.revokeObjectURL(enlace.href)
}
const hoy = () => { const fecha = new Date(); return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}` }

function cargarGastos(): Gasto[] {
  try {
    const datos: unknown = JSON.parse(localStorage.getItem(CLAVE) ?? '[]')
    if (!Array.isArray(datos) || !datos.every((item) => item && typeof item.id === 'string' && typeof item.fecha === 'string' && typeof item.descripcion === 'string' && typeof item.categoria === 'string' && validarGasto(item))) throw new Error()
    return datos
  } catch { throw new Error('No se pudieron leer los gastos guardados. Revisa el almacenamiento del navegador.') }
}

export default function App() {
  const [estadoInicial] = useState(() => { try { return { gastos: cargarGastos(), error: '' } } catch (error) { return { gastos: [] as Gasto[], error: (error as Error).message } } })
  const [gastos, setGastos] = useState<Gasto[]>(estadoInicial.gastos)
  const [error, setError] = useState(estadoInicial.error)
  const [fecha, setFecha] = useState(hoy)
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('')
  const [valor, setValor] = useState('')
  const [comprobante, setComprobante] = useState('')
  const total = gastos.reduce((suma, gasto) => suma + gasto.valor, 0)
  const hayGastosEnElMes = gastosDelMes(gastos, new Date()).length > 0
  const resumen = resumirCategorias(gastos).sort((a, b) => b[1] - a[1])

  function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const nuevo = { fecha, descripcion: descripcion.trim(), categoria, valor: Number(valor), comprobante: comprobante.trim() || undefined }
    if (!validarGasto(nuevo)) { setError('Completa todos los campos con un valor en pesos mayor que cero.'); return }
    const actualizados = [{ ...nuevo, id: crypto.randomUUID() }, ...gastos]
    try { localStorage.setItem(CLAVE, JSON.stringify(actualizados)) } catch { setError('No se pudo guardar el gasto. Revisa el almacenamiento del navegador.'); return }
    setGastos(actualizados); setDescripcion(''); setCategoria(''); setValor(''); setComprobante(''); setError('')
  }

  return <div className={styles.page}>
    <header className={styles.header}><div className={styles.brand}><span className={styles.brandMark}>c<span>.</span></span><div><strong>Caja menor</strong><small>Control de gastos</small></div></div><span className={styles.headerNote}><span className={styles.statusDot} /> REGISTRO DE OFICINA</span></header>
    <main className={styles.main}>
      <div className={styles.intro}><div><p className={styles.eyebrow}>TU ESPACIO DE TRABAJO <span> / </span> GASTOS</p><h1>Cada gasto,<br/><em>en su lugar.</em></h1><p className={styles.lead}>Lleva el control de los pequeños gastos que hacen funcionar tu oficina.</p></div><div className={styles.introAside}><span className={styles.asideIcon}>↗</span><p>Un registro claro<br/>para el día a día.</p></div></div>
      <section className={styles.overview} aria-label="Resumen de gastos"><div className={styles.totalBlock}><p className={styles.cardLabel}>TOTAL REGISTRADO</p><p className={styles.total}>{formatoPeso.format(total)}</p><p className={styles.totalCaption}>En {gastos.length} {gastos.length === 1 ? 'gasto registrado' : 'gastos registrados'}</p><p className={styles.totalCaption}>Total del mes: <strong>{formatoPeso.format(totalDelMes(gastos, new Date()))}</strong></p></div><div className={styles.summaryBlock}><div className={styles.summaryHeading}><div><p className={styles.cardLabel}>DISTRIBUCIÓN</p><h2>Por categoría</h2></div><span className={styles.summaryIcon}>◫</span></div>{resumen.length ? <div className={styles.categories}>{resumen.map(([nombre, monto]) => <div className={styles.category} key={nombre}><div className={styles.categoryLine}><span><i />{nombre}</span><strong>{formatoPeso.format(monto)}</strong></div><div className={styles.track}><div style={{ width: `${monto / total * 100}%` }} /></div></div>)}</div> : <p className={styles.emptySummary}>Aquí verás cómo se distribuyen tus gastos.</p>}</div></section>
      <div className={styles.workspace}><section className={styles.formPanel}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>NUEVO REGISTRO</p><h2>Agregar un gasto</h2></div><span className={styles.plus}>+</span></div><p className={styles.sectionIntro}>Completa los datos para mantener todo al día.</p><form onSubmit={guardar}><label htmlFor="fecha">Fecha</label><input id="fecha" type="date" value={fecha} onChange={e => setFecha(e.target.value)} required /><label htmlFor="descripcion">Descripción</label><input id="descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Ej. Resmas de papel" maxLength={120} required /><label htmlFor="categoria">Categoría</label><select id="categoria" value={categoria} onChange={e => setCategoria(e.target.value)} required><option value="">Selecciona una categoría</option>{categorias.map(item => <option key={item}>{item}</option>)}</select><label htmlFor="valor">Valor</label><div className={styles.moneyInput}><span>$</span><input id="valor" type="number" min="1" step="1" max="9007199254740991" value={valor} onChange={e => setValor(e.target.value)} placeholder="0" required /></div><label htmlFor="comprobante">Número de comprobante</label><input id="comprobante" value={comprobante} onChange={e => setComprobante(e.target.value)} placeholder="Opcional" maxLength={40} />{error &&<p className={styles.error} role="alert">{error}</p>}<button type="submit" disabled={!!estadoInicial.error}>Guardar gasto <span>↗</span></button></form></section>
      <section className={styles.listPanel}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>MOVIMIENTOS</p><h2>Gastos registrados</h2></div><span className={styles.count}>{gastos.length} {gastos.length === 1 ? 'gasto' : 'gastos'}</span></div><p className={styles.sectionIntro}>Un vistazo a todos los gastos de la oficina.</p><div className={styles.exportar}><button type="button" onClick={() => descargarExcel(gastos)} disabled={!hayGastosEnElMes}>Exportar gastos del mes</button>{!hayGastosEnElMes && <p role="alert">No hay gastos en el mes para exportar.</p>}</div>{gastos.length === 0 ? <div className={styles.empty}><div className={styles.emptyIcon}>≡<span>+</span></div><h3>Aún no hay gastos</h3><p>Cuando agregues tu primer gasto,<br/>aparecerá en este espacio.</p></div> : <div className={styles.tableWrap}><table><thead><tr><th>DESCRIPCIÓN</th><th>CATEGORÍA</th><th>FECHA</th><th>COMPROBANTE</th><th>VALOR</th></tr></thead><tbody>{gastos.map(gasto => <tr key={gasto.id}><td><strong>{gasto.descripcion}</strong></td><td><span className={styles.pill}>{gasto.categoria}</span></td><td>{gasto.fecha}</td><td>{gasto.comprobante}</td><td><strong>{formatoPeso.format(gasto.valor)}</strong></td></tr>)}</tbody></table></div>}</section></div>
      <footer className={styles.footer}><span>CAJA MENOR <span>✳</span> CONTROL DE OFICINA</span><span>Hecho para llevar las cuentas claras.</span></footer>
    </main></div>
}
