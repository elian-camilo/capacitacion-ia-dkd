# Spec: Exportar los gastos del mes para contabilidad

## Problema
El auxiliar de contabilidad necesita cuadrar los gastos de la caja menor contra el banco y sacar los totales para su reporte. Hoy los datos solo viven en la app, así que tiene que transcribirlos o calcularlos a mano.

## Para quién
- **Quien exporta:** usuario de la oficina que usa la app de caja menor.
- **Quien recibe el archivo:** el auxiliar de contabilidad, que lo abre en Excel.

## Qué debe hacer
1. Un botón de exportar genera un archivo con los gastos del **mes actual**, según la **fecha del gasto**. Por ahora no se puede elegir otro mes.
2. Cada gasto es una fila con: **fecha, valor, concepto, categoría, número de comprobante**. No incluye quién lo hizo.
3. Los campos vacíos (por ejemplo, sin comprobante) quedan en blanco. Los gastos incompletos se exportan igual.
4. Los valores van como **número puro, sin signo ni separadores** (ej. `1500000`), para que Excel los sume sin arreglos.
5. Las fechas van en formato `AAAA-MM-DD`.
6. Las filas van **ordenadas por fecha**.
7. El archivo incluye los **totales ya calculados**, **al final del archivo**: un total por categoría y el total del mes. La categoría "Banco" cuenta como cualquier otra en las sumas.
8. Los gastos sin categoría se agrupan en una línea aparte llamada **"Sin categoría"**. La suma de todas las líneas por categoría es igual al total del mes.
9. El archivo se llama `contabilidad_AAAA-MM-DD_HH-MM` (fecha y hora de la exportación).
10. Si el mes actual no tiene gastos, el botón está **deshabilitado** y se muestra una alerta que dice que no hay gastos en el mes.

## Criterios de aceptación (comprobables)
- [ ] Con gastos en el mes, el botón está habilitado y genera un archivo que abre en Excel sin errores.
- [ ] El archivo trae exactamente los gastos del mes actual, ni uno más ni uno menos, con las 5 columnas indicadas y sin la columna "quién".
- [ ] La columna de valor suma bien en Excel (`=SUMA`) sin ninguna limpieza previa.
- [ ] Todas las fechas cumplen `AAAA-MM-DD`.
- [ ] Un gasto sin comprobante o sin categoría aparece en el archivo, con las celdas vacías en blanco.
- [ ] Los gastos sin categoría salen en la línea "Sin categoría", y la suma de las líneas por categoría es igual al total del mes.
- [ ] El total del mes del archivo coincide con el total de la app en el momento de exportar.
- [ ] La suma de la categoría "Banco" del archivo coincide con el valor actual que muestra la app del banco.
- [ ] El nombre del archivo cumple `contabilidad_AAAA-MM-DD_HH-MM`.
- [ ] Sin gastos en el mes: botón deshabilitado y alerta visible; no se genera archivo.
- [ ] Las filas están ordenadas por fecha y los totales están al final del archivo.
- [ ] Un gasto de otro mes (por su fecha) no aparece en el archivo.
- [ ] Deseable, no bloqueante: las tildes y la ñ se ven bien al abrir el archivo en Excel.

## Fuera de alcance
- Elegir un mes distinto del actual (queda para después).
- Mostrar quién registró el gasto.
- Enviar el archivo por correo o conectarlo con otro sistema contable.
- Corregir o bloquear gastos incompletos antes de exportar.
- Ingresos o devoluciones: la app no los maneja por ahora.

## Dudas abiertas
Resueltas (ya incorporadas arriba): total del archivo se compara con el total del mes de la app; "Banco" suma como categoría normal; no hay ingresos ni devoluciones; totales al final; filas por fecha; el mes se define por la fecha del gasto; los valores son número sin puntos ni signo.

Pendiente:
1. **Tildes y ñ:** prioridad baja. Importa más que los cálculos sean correctos. No bloquea la entrega, pero conviene probarlo una vez en el Excel de contabilidad.
2. **Mes actual:** se asume la fecha de Colombia al momento de exportar.
