# Caja menor

App interna para una oficina en Colombia.

## Stack
- React 18 + Vite + TypeScript estricto.
- Tests con Vitest + Testing Library.
- Estilos con CSS plano (módulos CSS). Sin librerías de UI.
- Datos en localStorage. No hay backend.

## Comandos
- `npm run dev`: servidor local.
- `npm test`: tests. Deben pasar antes de dar la tarea por terminada.

## Convenciones
- Estructura por funcionalidad: `src/features/<nombre>/` con componente, lógica y test juntos.
- La lógica (cálculos, validaciones) va en funciones puras separadas de los componentes, y cada una tiene test.
- Textos de la interfaz en español de Colombia.
- Valores en pesos colombianos: `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })`.
- Fechas en formato AAAA-MM-DD.
- Accesibilidad: todo campo con su `label`, navegable con teclado.

## Nunca
- Agregar dependencias fuera del stack sin preguntar.
- Dar por terminado algo con tests fallando.
