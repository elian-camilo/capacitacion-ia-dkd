# Capacitación de IA para DKD

Material de las sesiones de capacitación en desarrollo con IA para el equipo
de DKD. Por Carlos René Angarita Sanguino y Elian Camilo Angarita Sanguino.

Cada sesión le suma una pieza a la forma en que el equipo trabaja con IA:
reglas, skills, contexto, specs, subagentes y, al final, el harness
completo.

## Contenido

```text
diapositivas/
  sesion-01.html        Diapositivas de la sesión 1 (se abren en el navegador)
  sesion-01.pdf         Las mismas, en PDF
sesion-01/
  guion.md              Guion minuto a minuto para quien presenta
  rubrica.md            Rúbrica para comparar los resultados de la demo
  demo/
    prompt.md           El prompt de la demo, idéntico para A y B
    a-sin-nada/         Proyecto de prueba SIN configuración (vacío a propósito)
    b-configurado/      Proyecto de prueba CON reglas y una skill
      AGENTS.md
      .claude/skills/frontend-design/   para Claude Code
      .agents/skills/frontend-design/   para Codex
plantillas/
  AGENTS.md             Plantilla del archivo de reglas
  CLAUDE.md             Puente para Claude Code que importa AGENTS.md
  skill-ejemplo/        Ejemplo de estructura de una skill
```

## Diapositivas

Abrir `diapositivas/sesion-01.html` en Chrome, Brave, Edge o Firefox.

| Tecla | Acción |
|---|---|
| Flechas, espacio | Avanzar y retroceder |
| N | Mostrar u ocultar las notas de quien presenta |
| E | Modo edición (por ejemplo, para llenar la rúbrica en vivo) |
| Ctrl+S | Descargar una copia con los cambios |
| F11 | Pantalla completa |

Necesita internet solo para cargar la tipografía; sin internet funciona
igual con una letra de respaldo.

Las capturas de la demo se muestran en la diapositiva 15 si se guardan como
`diapositivas/demo-1.png` y `diapositivas/demo-2.png`.

## Sesión 1: reglas y skills

| Hora | Bloque |
|---|---|
| 0:00 | Apertura y lanzar la demo |
| 0:10 | Diagnóstico: cómo usan la IA hoy |
| 0:30 | La idea central, chat vs. editor vs. agente, seguridad |
| 0:45 | Reglas: AGENTS.md y CLAUDE.md |
| 1:00 | Skills |
| 1:15 | Revelación de la demo y rúbrica |
| 1:35 | Práctica en su propio repo |
| 1:55 | Tarea para la próxima sesión |

El detalle está en `sesion-01/guion.md`.

## Demo: mismo prompt, con y sin configuración

La demo funciona con **Claude Code** o con **Codex**. Lo que importa es que
las dos corridas (A y B) usen la misma herramienta, el mismo modelo y la
misma máquina.

### 1. Usar una máquina sin configuración global

Si la herramienta ya tiene reglas, skills o plugins globales, esos se
cargan en las dos corridas y la comparación no vale. Revisen que no exista:

| Herramienta | Configuración global que contamina la demo |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md`, `~/.claude/skills/`, hooks y plugins |
| Codex | `~/.codex/AGENTS.md`, `~/.agents/skills/`, `~/.codex/hooks.json` y plugins |

Lo más simple es un portátil con la herramienta recién instalada.

### 2. Instalar la herramienta

Requiere Node.js 22 o superior (Claude Code lo exige; revisar con `node --version`).

```bash
npm install -g @anthropic-ai/claude-code
```

```bash
npm install -g @openai/codex
```

Iniciar sesión una vez al abrirla por primera vez.

### 3. Copiar los proyectos de prueba FUERA de este repo

Las dos carpetas se corren fuera del repo para que la herramienta no lea
nada de aquí ni el código generado termine dentro del repo.

```bash
cp -r sesion-01/demo ~/demo-dkd
```

### 4. Lanzar las dos corridas

Dos terminales. En la primera:

```bash
cd ~/demo-dkd/a-sin-nada && claude
```

En la segunda:

```bash
cd ~/demo-dkd/b-configurado && claude
```

Con Codex es igual, cambiando `claude` por `codex`. Pegar en las dos el
prompt de `sesion-01/demo/prompt.md` y aprobar los comandos (`npm install`,
tests) cuando los pida. **No saltarse los permisos**: es justo lo que se
enseña a no hacer.

Para confirmar que B cargó las reglas: Claude Code muestra
`AGENTS.md loaded` al iniciar (requiere la versión 2.1.277 o superior;
revisar con `claude --version`).

### 5. Comparar

Abrir las dos apps lado a lado, votar a ciegas cuál le entregarían a un
cliente y llenar `sesion-01/rubrica.md` entre todos.

### Recomendación

Correr la demo completa antes de la sesión y guardar capturas. Generar una
app toma de 5 a 15 minutos y en vivo puede fallar la red o la herramienta.

## Práctica en su propio repo

1. Abrir su proyecto y generar un borrador con `/init` (Claude Code y Codex lo tienen) o copiar `plantillas/AGENTS.md`.
2. Dejar solo lo útil y agregar 3 reglas que hoy le repiten a mano a la IA.
3. Pedirle una tarea pequeña real y ver si las respeta.

¿Qué archivo usar?

| Si el equipo usa | Archivo |
|---|---|
| Solo Claude Code | `CLAUDE.md` |
| Codex, Cursor, Copilot u otra | `AGENTS.md` |
| Varias herramientas | `AGENTS.md`, y si hace falta algo solo para Claude, `plantillas/CLAUDE.md` |

## Tarea para la sesión 2

Usar su archivo de reglas en el trabajo de la semana y anotar:
- Una vez en que la IA no respetó una regla.
- Algo que tuvieron que repetirle y que debería estar en el archivo.

## Seguridad

- Permisos en modo aprobar. Nada de saltarse todos los permisos.
- Ningún secreto, token ni clave en los archivos de reglas.
- Revisar el diff antes de cada commit.
- Una skill de terceros es código ajeno: se lee antes de instalarla.

## Recursos

**Reglas**
- AGENTS.md, el formato abierto: https://agents.md
- Claude Code, cómo usa CLAUDE.md y AGENTS.md: https://code.claude.com/docs/en/memory

**Skills**
- Directorio de skills con buscador y número de instalaciones: https://skills.sh
- Skills oficiales de Anthropic (de aquí sale `frontend-design`): https://github.com/anthropics/skills
- Especificación abierta de Agent Skills: https://agentskills.io
- Skills en Codex: https://learn.chatgpt.com/docs/build-skills
- Buscar e instalar skills desde la terminal: `npx skills find <tema>` y `npx skills add <dueño/repo>`

**Herramientas**
- Claude Code: https://code.claude.com/docs
- Codex: https://developers.openai.com/codex

## Licencias

La skill `frontend-design` es de Anthropic y se distribuye bajo Apache 2.0
(ver `LICENSE.txt` dentro de su carpeta). El resto del material es de los
autores de la capacitación.
