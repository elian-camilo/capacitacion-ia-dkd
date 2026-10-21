# Sesión 1: reglas y skills (guion del facilitador)

**Objetivo:** que salgan convencidos de que la calidad de la IA depende más
de cómo la configuran que del modelo, y con su propio CLAUDE.md hecho.

**Llevar:** portátil con las dos carpetas de la demo listas
(ver README, sección Demo), respaldo pregrabado, tablero o pantalla para anotar.

| Hora | Bloque | Min |
|---|---|---|
| 0:00 | Apertura y lanzar la demo | 10 |
| 0:10 | Diagnóstico | 20 |
| 0:30 | Modelo mental + terminal vs. app | 15 |
| 0:45 | Reglas (CLAUDE.md) | 15 |
| 1:00 | Skills | 15 |
| 1:15 | Revelación de la demo | 20 |
| 1:35 | Práctica en su repo | 20 |
| 1:55 | Cierre y tarea | 5 |

## 0:00 Apertura y lanzar la demo (10 min)
- Presentación en una frase: "Vengo a ver cómo trabajan con IA y a mostrarles cómo sacarle el doble con cosas sencillas".
- **Lanzar ya las dos corridas** (A sin nada, B con configuración) en dos terminales del mismo portátil, con el mismo prompt. Decir: "Le acabo de pedir lo mismo a la misma IA, dos veces. Lo vemos en una hora".
- Esto genera expectativa y quita el tiempo muerto de esperar a que genere.

## 0:10 Diagnóstico (20 min)
- Ronda rápida: cada uno cuenta (o muestra en pantalla) la última vez que usó IA para trabajar. ¿Qué pidió, qué salió, qué tuvo que corregir?
- Anotar en el tablero tres columnas: **herramienta**, **tarea**, **frustración**.
- No corregir a nadie todavía. Solo escuchar y anotar. Al final de la serie se vuelve a este tablero.
- Pedir una **línea base**: "¿Cuánto les toma hoy hacer un CRUD / un endpoint / una pantalla típica?". Anotarlo.

## 0:30 Modelo mental + terminal vs. app (15 min)
Idea central: **la IA es un dev senior que llega nuevo cada mañana y no se acuerda de nada.** Sabe programar, pero no conoce su proyecto, su stack, sus convenciones ni sus reglas.

- Cada conversación arranca de cero. Lo que no le dicen, lo adivina. Y adivina lo más genérico.
- Las reglas son el **onboarding** que le darían a un dev nuevo. Las skills son los **manuales** que consulta cuando le toca una tarea específica.
- Chat en el navegador vs. editor vs. terminal (agente):
  - Chat: copiar y pegar, la IA no ve su proyecto.
  - Editor (Copilot, Cursor): ve archivos, sugiere.
  - Agente en terminal o app (Claude Code): lee el repo, corre comandos, ejecuta tests, se corrige solo. Terminal y app de escritorio son la misma herramienta con distinta cara; elijan la que les quede cómoda.
- **Seguridad desde hoy** (2 min): el agente corre comandos en su máquina. Permisos en modo de aprobar, nunca secretos en el CLAUDE.md, revisar el diff antes de hacer commit. El código lo firma quien hace el commit, no la IA.

## 0:45 Reglas: CLAUDE.md (15 min)
- Qué es: un archivo en la raíz del repo que la IA lee **siempre**, en cada conversación.
- Mostrar el AGENTS.md de la carpeta B de la demo (corto, se lee en pantalla).
- Qué poner:
  - Stack y versiones.
  - Comandos: cómo correr, testear, hacer lint.
  - Convenciones que no son obvias (estructura de carpetas, nombres, idioma).
  - Lo que NUNCA debe hacer (tocar migraciones, agregar dependencias sin preguntar).
- Qué NO poner:
  - Lo que ya hace el linter o el formateador.
  - Novelas: si pasa de ~200 líneas, la IA le presta menos atención a cada regla y gasta contexto (gancho para la sesión 2).
  - Secretos.
- Niveles: global (`~/.claude/CLAUDE.md`, sus preferencias personales) y de proyecto (el del repo, compartido por el equipo en git).
- Si usan otra herramienta: es la misma idea con otro nombre (`AGENTS.md`, `.cursorrules`, `.github/copilot-instructions.md`).
- Truco: `/init` genera un primer borrador leyendo el repo. Se edita, no se acepta tal cual.

## 1:00 Skills (15 min)
- Qué es: una carpeta con un `SKILL.md` (instrucciones + ejemplos + scripts) para una tarea específica.
- Diferencia clave con las reglas:
  - **Reglas:** se cargan siempre. Para lo que aplica a todo.
  - **Skills:** la IA solo ve el nombre y la descripción; abre el contenido completo **cuando la tarea lo necesita**. Por eso pueden ser largas sin gastar contexto.
- Mostrar `frontend-design` (la de la carpeta B): leer la descripción y un par de reglas internas.
- Dónde viven: `.claude/skills/` del repo (equipo) o `~/.claude/skills/` (personal).
- Hay skills públicas listas para instalar. La regla de hoy: **instalar y usar antes de crear.** Crear las propias va más adelante.
- Ojo de seguridad: una skill es código e instrucciones de un tercero. Se lee antes de instalar, como cualquier dependencia.

## 1:15 Revelación de la demo (20 min)
- Abrir las dos apps en el navegador, lado a lado, **sin decir cuál es cuál**.
- Votación a mano alzada: ¿cuál le entregarían a un cliente?
- Revelar. Recorrer la rúbrica de `sesion-01/rubrica.md` en pantalla: correr tests, mirar estructura, buscar dependencias de más.
- Cerrar con la frase: "Mismo modelo, mismo prompt. La diferencia son dos archivos que tardé 20 minutos en escribir".
- Honestidad: una corrida es una anécdota; la IA no es determinista. Pero la diferencia se repite cada vez, y eso lo comprueban ellos esta semana.

## 1:35 Práctica en su repo (20 min)
En parejas si alguien no tiene la herramienta instalada.
1. Abrir su proyecto real y correr `/init` (o crear el archivo a mano con la plantilla de `plantillas/AGENTS.md`).
2. Editarlo: dejar solo lo útil y agregar **3 reglas** que hoy repiten a mano a la IA.
3. Pedirle a la IA una tarea pequeña real y ver si respeta las reglas.

Pasar por los puestos. Los errores típicos: CLAUDE.md larguísimo, reglas vagas ("escribe buen código"), reglas que contradicen el código existente.

## 1:55 Cierre y tarea (5 min)
- Tarea de la semana: usar su CLAUDE.md en el trabajo diario y **anotar una vez en que la IA no lo respetó o algo que tuvieron que repetirle**. Eso se revisa en los primeros 10 min de la sesión 2.
- Gancho: "La próxima vez vamos a ver por qué la IA se 'olvida' de cosas en conversaciones largas y cuánto cuesta eso en tokens".
