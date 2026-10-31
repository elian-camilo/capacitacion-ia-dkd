# Spec: Exportar los gastos del mes

## Problema
Contabilidad compara los gastos de la caja menor con los extractos del banco. Hoy no tiene un archivo con los gastos del mes que pueda abrir en Excel, así que debe copiarlos a mano.

## Para quién
El auxiliar de contabilidad y el contador. El auxiliar abre el archivo en Excel para cuadrarlo contra el extracto bancario.

## Qué debe hacer
1. Exportar los gastos del **mes actual** a un archivo `.xlsx` nativo que Excel abra sin arreglos.
2. El mes actual va desde el día 1 a las 00:00 hasta el último día a las 23:59, en hora de Colombia. Un gasto pertenece al mes según la **fecha del gasto**, no la fecha en que se registró.
3. El archivo tiene dos hojas:
   - **Gastos**: una fila por gasto con fecha, descripción, valor, categoría y comprobante. No incluye quién lo registró. Fecha y valor son imprescindibles.
   - **Totales**: el **total del mes** y un **subtotal por cada categoría**, incluida "Sin categoría".
4. La fecha va en formato AAAA-MM-DD.
5. El valor va como número plano, sin signo de pesos ni separadores (ej. `150000`), para que Excel lo sume.
6. Un gasto sin categoría aparece con la categoría "Sin categoría", tiene su subtotal y cuenta en el total del mes.
7. Un gasto sin comprobante muestra `N/A` en la columna comprobante.
8. El archivo se llama `gastos-AAAA-MM-DD_HH-MM.xlsx`, con la fecha y hora de la descarga en hora de Colombia.
9. Si el mes actual no tiene gastos, se genera igual el archivo: la hoja Gastos solo con los encabezados y la hoja Totales con el total del mes en 0.
10. El boton debe tener el color verde de fondo y letras blancas, debe estas junto al boton de guardar gasto. Con un borde naranja.

## Restricciones
- Sin librerías externas: no se agrega ninguna dependencia al proyecto.
- Se mantienen las convenciones de [AGENTS.md](../AGENTS.md): textos en español de Colombia, fechas AAAA-MM-DD, `npm test` en verde.

## Criterios de aceptación
- [x] Con gastos en el mes actual, se descarga un `.xlsx` que Excel abre sin errores ni avisos de reparación.
- [x] El archivo tiene las hojas "Gastos" y "Totales".
- [ ] Solo aparecen gastos del mes actual por fecha del gasto; uno del 1.º a las 00:00 entra, uno del último día a las 23:59 entra, uno del mes anterior o siguiente no.
- [x] Cada fila tiene fecha (AAAA-MM-DD), descripción, valor, categoría y comprobante; no aparece "quién lo hizo".
- [ ] Excel suma la columna de valores sin convertir nada (son números, no texto).
- [ ] El total del mes en "Totales" es igual al total del mes que muestra la app en el momento de la descarga.
- [ ] La suma de las filas de "Gastos" es igual al total del mes.
- [ ] La suma de los subtotales por categoría es igual al total del mes.
- [ ] Un gasto sin categoría sale como "Sin categoría", tiene su subtotal y está incluido en el total del mes.
- [ ] Un gasto sin comprobante muestra `N/A`.
- [ ] El nombre sigue el formato `gastos-AAAA-MM-DD_HH-MM.xlsx` con fecha y hora reales de la descarga, hora de Colombia.
- [ ] Con un mes sin gastos se descarga el archivo con "Gastos" solo con encabezados y "Totales" con el total del mes en 0.
- [ ] `package.json` no cambia sus dependencias.

## Fuera de alcance
- Elegir otro mes distinto al actual.
- Incluir quién registró el gasto.
- Formato visual en el archivo (colores, símbolos de pesos, separadores de miles).
- Enviar el archivo por correo o subirlo a alguna parte; el auxiliar lo descarga y lo gestiona él.
- Comparar o conciliar automáticamente con el extracto del banco.

## Dudas
1. Hora del gasto: ¿el gasto guarda solo fecha o también hora? La ventana 00:00–23:59 solo tiene efecto si hay hora; si es solo fecha, basta con el día.
2. ¿Quién es "el contador" y qué hace distinto al auxiliar con el archivo? Se asume que usa el mismo archivo.
3. Un `.xlsx` sin librerías externas implica construir el archivo a mano; hay que confirmar en el diseño que es viable dentro del stack.
