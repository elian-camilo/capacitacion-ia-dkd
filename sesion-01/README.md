# Sesión 1: reglas y skills

**Fecha:** 2026-10-21

**Idea principal:** la calidad de lo que entrega la IA depende más de cómo
la configuramos que del modelo. Con dos archivos, un archivo de reglas y una
skill, el salto de calidad se nota desde el primer día.

Material: [diapositivas](diapositivas.html) ([PDF](diapositivas.pdf)) y
[la demo](demo/).

## 1. La IA no conoce su proyecto

La IA es como un desarrollador senior que llega nuevo cada mañana y no se
acuerda de nada. Sabe programar, pero no conoce su proyecto, su stack ni los
acuerdos del equipo. Lo que no le dicen, lo adivina, y adivina lo más
genérico.

Por eso existen dos piezas:
- **Reglas:** el onboarding que le darían a alguien nuevo. Se lee siempre.
- **Skills:** los manuales de procedimiento que consulta cuando le toca una tarea específica.

## 2. Chat, editor o agente

| Dónde | Ve el proyecto | Corre comandos | Ejemplos |
|---|---|---|---|
| Chat en el navegador | No, se copia y pega | No | ChatGPT, Claude.ai |
| Editor | Los archivos abiertos | Poco | Copilot, Cursor |
| Agente (terminal o app) | Todo el repo | Sí: tests, build, git | Claude Code, Codex |

El agente es donde más se nota la configuración, porque lee el repo, corre
los tests y se corrige solo. La terminal y la aplicación de escritorio son la
misma herramienta con distinta cara.

## 3. Reglas: el archivo que la IA lee al empezar

Un archivo en la raíz del repo que la IA lee completo al empezar cada
conversación. Cada herramienta le pone su nombre:

| Archivo | Lo leen |
|---|---|
| `AGENTS.md` | Codex, Cursor, Copilot, Claude Code y la mayoría |
| `CLAUDE.md` | Claude Code |
| `.github/copilot-instructions.md` | GitHub Copilot |
| `.cursor/rules/` | Cursor |
| `GEMINI.md` | Gemini CLI (se puede configurar para leer `AGENTS.md`) |

**Recomendación para un equipo con varias herramientas:** un solo
`AGENTS.md`. Claude Code lo lee directo cuando no hay `CLAUDE.md` (desde la
versión 2.1.277). Si alguien necesita reglas solo para Claude, crea un
`CLAUDE.md` con la línea `@AGENTS.md` al inicio, que importa el compartido
sin duplicarlo (ver [plantillas/CLAUDE.md](../plantillas/CLAUDE.md)).

### Qué va y qué no

| Sí va | No va |
|---|---|
| Stack y versiones | Lo que ya hace el linter o el formateador |
| Comandos: correr, testear, lint | Reglas vagas como "escribe buen código" |
| Acuerdos que no son obvios (estructura, nombres, idioma) | Más de unas 200 líneas: gasta contexto y la IA respeta menos cada regla |
| Lo que nunca debe hacer | Secretos, tokens o claves |

Regla práctica: si se lo tienen que repetir a la IA más de dos veces, va al
archivo. Si aplicaría a cualquier proyecto del mundo, no aporta.

### Dos niveles

- **Proyecto:** en la raíz del repo, versionado en git. Lo comparte todo el equipo.
- **Personal:** en su carpeta de usuario (`~/.claude/CLAUDE.md` en Claude Code, `~/.codex/AGENTS.md` en Codex). Sus preferencias: idioma, tono, cómo les gusta que les expliquen.

`/init` (en Claude Code y Codex) lee el repo y escribe un primer borrador.
Se edita, no se acepta tal cual.

## 4. Skills: manuales que se abren cuando hacen falta

Una skill es una carpeta con un archivo `SKILL.md`: instrucciones, ejemplos y
scripts para una tarea específica.

```text
.claude/skills/frontend-design/     (Claude Code)
.agents/skills/frontend-design/     (Codex)
  SKILL.md
  ...
```

La diferencia clave con las reglas:
- **Reglas:** entran completas en cada conversación. Por eso tienen que ser cortas.
- **Skills:** al empezar, la IA solo ve el nombre y la descripción de cada una. Abre el contenido completo cuando la tarea lo necesita. Por eso una skill puede ser larga sin estorbar.

Por lo mismo, **la descripción es lo más importante de una skill**: la IA
decide si la abre leyendo solo esa línea. Tiene que decir qué hace y cuándo
usarla.

`SKILL.md` es un formato abierto: lo leen Claude Code, Codex, Cursor, Copilot
y Gemini CLI. Cambia la carpeta, no el archivo.

**Primero instalar, después crear.** Hay muchas skills públicas listas
(https://skills.sh). Una skill de terceros es código ajeno corriendo en su
máquina: se lee antes de instalarla, como cualquier dependencia.

## 5. La demo: mismo prompt, con y sin configuración

Le pedimos lo mismo a la misma IA dos veces: una en una carpeta vacía y otra
en una carpeta con un `AGENTS.md` y la skill `frontend-design`. Después
comparamos los resultados con una rúbrica.

Una sola corrida es una anécdota, porque la IA no da siempre el mismo
resultado. Las reglas suben el piso, no garantizan el techo. La prueba real
es usarlas en su propio código.

Todo lo necesario para repetirla está en [demo/](demo/).

## 6. Seguridad desde el día 1

- Permisos en modo aprobar. Nada de saltarse todos los permisos.
- Ningún secreto, token ni clave en los archivos de reglas.
- Revisar el diff antes de cada commit.
- El código lo firma quien hace el commit, no la IA.

## Ejercicio

1. Abran su proyecto real y generen un borrador con `/init`, o copien [plantillas/AGENTS.md](../plantillas/AGENTS.md).
2. Dejen solo lo útil y agreguen 3 reglas que hoy le repiten a mano a la IA.
3. Pídanle una tarea pequeña real y miren si las respeta.

## Tarea para la sesión 2

Usen su archivo de reglas en el trabajo de la semana y anoten:
- Una vez en que la IA no respetó una regla.
- Algo que tuvieron que repetirle y que debería estar en el archivo.

Lo revisamos al empezar la próxima sesión, que trata de por qué la IA "se
olvida" de cosas en conversaciones largas y cuánto cuesta eso en tokens.
