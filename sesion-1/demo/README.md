# Demo: mismo prompt, con y sin configuración

| | Qué tiene |
|---|---|
| [a-sin-nada/](a-sin-nada/) | Nada. Vacía a propósito. |
| [b-configurado/](b-configurado/) | Un [AGENTS.md](b-configurado/AGENTS.md) con las reglas y la skill `frontend-design` (en `.claude/skills/` para Claude Code y en `.agents/skills/` para Codex). Son carpetas ocultas: en el explorador de archivos se ven con Ctrl+H. |
| [resultados/](resultados/) | La evidencia de lo que salió en la sesión: capturas, código generado y la rúbrica llena. |

## El prompt

El mismo, idéntico, en las dos carpetas:

```text
Crea una app web para registrar los gastos de caja menor de una oficina.
Debe permitir agregar un gasto (fecha, descripción, categoría y valor),
ver la lista de gastos y ver el total por categoría.
```

Es corto y ambiguo a propósito: así se nota qué decide la IA sola (A) y qué
decide por las reglas (B).

## Cómo repetirla

**1. Usen una herramienta sin configuración global.** Si su Claude Code o
Codex ya tiene reglas, skills o plugins globales, esos se cargan en las dos
corridas y la comparación no vale.

| Herramienta | Configuración global que afecta la demo |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md`, `~/.claude/skills/`, hooks y plugins |
| Codex | `~/.codex/AGENTS.md`, `~/.agents/skills/`, `~/.codex/hooks.json` y plugins |

**2. Instalen la herramienta** si no la tienen. Claude Code requiere Node.js
22 o superior (revisar con `node --version`).

```bash
npm install -g @anthropic-ai/claude-code
```

```bash
npm install -g @openai/codex
```

**3. Copien las dos carpetas fuera del repo**, para que la herramienta no
lea nada del repo y el código generado no quede adentro. Desde la raíz del
repo:

```bash
mkdir -p ~/demo-dkd && cp -r sesion-1/demo/a-sin-nada sesion-1/demo/b-configurado ~/demo-dkd/
```

**4. Lancen las dos corridas** en dos terminales, con la misma herramienta,
y peguen el prompt en las dos:

```bash
cd ~/demo-dkd/a-sin-nada && claude
```

```bash
cd ~/demo-dkd/b-configurado && claude
```

Con Codex, cambien `claude` por `codex`. Aprueben los comandos cuando los
pida (`npm install`, tests).

**5. Comparen** con la rúbrica de abajo: primero miren las dos apps sin saber
cuál es cuál, después revisen criterio por criterio.

## Rúbrica

| Criterio | Cómo se mira | A | B |
|---|---|---|---|
| Funciona sin tocar nada | `npm install && npm run dev` | | |
| Tiene tests y pasan | `npm test` | | |
| La lógica está separada y probada | abrir `src/` | | |
| Formato de pesos y fechas | agregar un gasto de 15000 | | |
| Diseño con intención (no genérico) | mirarlo | | |
| Sin dependencias de más | `package.json` | | |
| Accesible con teclado | tabular por el formulario | | |

Si A gana en algo, es normal: la IA no da siempre el mismo resultado. Las
reglas suben el piso, no garantizan el techo.

## Para practicar

- Quiten la skill de B y corran de nuevo: ¿qué cambia en el diseño?
- Quiten la regla de los tests del `AGENTS.md` y miren si la IA deja de hacerlos.
- Cambien el prompt por una tarea típica de su trabajo y escriban un `AGENTS.md` para ella.
