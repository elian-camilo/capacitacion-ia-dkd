# Sesión 2: contexto

[Diapositivas (PDF)](diapositivas.pdf) · [Diapositivas (HTML)](diapositivas.html)

## Qué vimos

1. **El contexto es la mesa de trabajo de la IA.** Todo lo que "sabe" en una conversación está encima, y la mesa tiene tamaño fijo.
2. **Qué hay en la mesa:** sus instrucciones, el archivo de reglas completo, la descripción de cada skill, la conversación y cada archivo o salida de comando que leyó. Esto último es lo que más llena.
3. **La IA no se acuerda: relee.** En cada mensaje la herramienta le manda la conversación completa otra vez. Una pregunta corta en una sesión larga cuesta como toda la sesión.
4. **Con licencia gastan cupo.** En los planes de equipo, el chat de Claude y Claude Code comparten el mismo cupo, que se renueva cada 5 horas y cada semana.
5. **Mucho antes de llenarse, rinde peor.** Por eso "se le olvidan" las reglas en conversaciones largas. Compactar resume lo anterior, pero se pierden detalles.

## Comandos

| Para | Claude Code | Chat de Claude |
|---|---|---|
| Ver el contexto | `/context` | la conversación entera es el contexto |
| Ver el consumo | `/usage` | Configuración > Uso |
| Arrancar limpio (gratis) | `/clear` | Nueva conversación |
| Resumir (petición grande) | `/compact conserva ...` | no aplica |
| Volver a una conversación anterior (`/clear` no la borra) | `/resume`; `/rename` le pone nombre | |
| Regresar a un mensaje anterior (conversación, código o ambos) | `/rewind` o `Esc` dos veces | |

¿Siguen con lo mismo? `/compact`. ¿Cambian de tarea? `/clear`.

## Seis hábitos

1. Una tarea por conversación.
2. Pedidos específicos: nombren el archivo.
3. Peguen el error, no el log entero.
4. Reglas cortas: menos de 200 líneas; lo especializado, a una skill.
5. Si va por mal camino, `Esc` y corregir, o `/rewind` para volver a un mensaje anterior.
6. Lo ruidoso (tests, documentación), a un subagente. Sesión 4.

## Ejercicio

1. Abran su conversación más larga y corran `/context`. ¿Qué ocupa más?
2. Abran `/usage`: desglose y recomendaciones.
3. Apliquen un arreglo: `/clear`, recortar sus reglas o apagar un MCP que no usen (`/mcp`).
4. Corran `/context` otra vez y comparen.

## Tarea para la sesión 3

- `/clear` cada vez que cambien de tarea.
- El viernes, abran `/usage` y anoten qué les gastó más el cupo.

## Para leer más

- Manejo de costos y contexto en Claude Code: https://code.claude.com/docs/en/costs
