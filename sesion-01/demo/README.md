# Demo: mismo prompt, con y sin configuración

El experimento de la sesión 1, para que lo puedan repetir.

| Carpeta | Qué tiene |
|---|---|
| `a-sin-nada/` | Nada. Vacía a propósito. |
| `b-configurado/` | Un `AGENTS.md` con las reglas del proyecto y la skill `frontend-design` (en `.claude/skills/` para Claude Code y en `.agents/skills/` para Codex). |
| `prompt.md` | El prompt, idéntico para las dos. |
| `rubrica.md` | Cómo comparar los resultados. |
| `resultados/` | La evidencia de lo que salió en la sesión. |

## Cómo repetirla

**1. Usen una herramienta sin configuración global.** Si su Claude Code o
Codex ya tiene reglas, skills o plugins globales, esos se cargan en las dos
corridas y la comparación no vale.

| Herramienta | Configuración global que afecta la demo |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md`, `~/.claude/skills/`, hooks y plugins |
| Codex | `~/.codex/AGENTS.md`, `~/.agents/skills/`, `~/.codex/hooks.json` y plugins |

**2. Instalen la herramienta** si no la tienen. Requiere Node.js 22 o
superior para Claude Code (revisar con `node --version`).

```bash
npm install -g @anthropic-ai/claude-code
```

```bash
npm install -g @openai/codex
```

**3. Copien las dos carpetas fuera de este repo**, para que la herramienta no
lea nada del repo y el código generado no quede adentro.

```bash
cp -r sesion-01/demo ~/demo-dkd
```

**4. Lancen las dos corridas** en dos terminales, con la misma herramienta.

```bash
cd ~/demo-dkd/a-sin-nada && claude
```

```bash
cd ~/demo-dkd/b-configurado && claude
```

Con Codex, cambien `claude` por `codex`. Peguen en las dos el prompt de
`prompt.md` y aprueben los comandos cuando los pida (`npm install`, tests).

**5. Comparen** con la [rúbrica](rubrica.md): primero miren las dos apps sin
saber cuál es cuál, después revisen criterio por criterio.

## Variaciones para practicar

- Quiten la skill de B y corran de nuevo: ¿qué cambia en el diseño?
- Quiten una regla del `AGENTS.md` (por ejemplo, la de los tests) y miren si la IA deja de hacerlos.
- Cambien el prompt por una tarea típica de su trabajo y escriban un `AGENTS.md` para ella.
