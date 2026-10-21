# Sesión 1: reglas y skills

2026-10-21 · [Diapositivas (PDF)](diapositivas.pdf) · [Diapositivas (HTML)](diapositivas.html)

## Qué vimos

1. **La IA no conoce su proyecto.** Sabe programar, pero lo que no le dicen lo adivina, y adivina lo más genérico.
2. **Reglas:** un archivo en la raíz del repo que la IA lee al empezar cada conversación. `AGENTS.md` lo leen casi todas las herramientas; `CLAUDE.md` es el de Claude Code.
3. **Qué va en las reglas:** stack, comandos, acuerdos que no son obvios y lo que nunca debe hacer. Corto: lo que hoy le repiten a mano.
4. **Skills:** carpetas con un `SKILL.md` que la IA abre solo cuando la tarea lo necesita. La descripción es lo que decide si la abre.
5. **Seguridad:** permisos en modo aprobar, nada de secretos en las reglas, revisar el diff antes del commit.

Si usan Claude Code y Codex en el mismo repo: un solo `AGENTS.md`. Si
necesitan algo solo para Claude, un `CLAUDE.md` que empiece con:

```markdown
@AGENTS.md
```

## Ejercicio

1. En su proyecto real, generen un borrador con `/init` o copien [plantilla-AGENTS.md](plantilla-AGENTS.md).
2. Dejen solo lo útil y agreguen 3 reglas que hoy le repiten a mano a la IA.
3. Pídanle una tarea pequeña real y miren si las respeta.

## Tarea para la sesión 2

Usen su archivo de reglas esta semana y anoten una vez en que la IA no lo
respetó y algo que tuvieron que repetirle.

## Repetir la demo

Mismo prompt en dos carpetas: [a-sin-nada](demo/a-sin-nada/) (vacía) y
[b-configurado](demo/b-configurado/) (un [AGENTS.md](demo/b-configurado/AGENTS.md)
y la skill `frontend-design` en las carpetas ocultas `.claude/skills/` y
`.agents/skills/`).

1. Usen Claude Code o Codex **sin reglas, skills ni plugins globales**, o las dos corridas salen configuradas.
2. Copien las carpetas fuera del repo: `mkdir -p ~/demo-dkd && cp -r sesion-1/demo/* ~/demo-dkd/`
3. En dos terminales, abran `claude` (o `codex`) en cada carpeta.
4. Peguen en las dos este prompt:

```text
Crea una app web para registrar los gastos de caja menor de una oficina.
Debe permitir agregar un gasto (fecha, descripción, categoría y valor),
ver la lista de gastos y ver el total por categoría.
```

5. Comparen: ¿funciona sin tocar nada?, ¿tiene tests y pasan?, ¿pesos y fechas bien?, ¿diseño con intención?, ¿dependencias de más?, ¿se usa con teclado?
