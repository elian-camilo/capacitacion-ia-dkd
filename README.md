# Capacitación de IA para DKD

Material de estudio de la capacitación en desarrollo con IA para el equipo
de DKD, dictada por Carlos René Angarita Sanguino y Elian Camilo Angarita
Sanguino.

Aquí queda todo lo que vimos en cada sesión: las diapositivas, los apuntes,
los ejercicios y la evidencia de las demostraciones, para que lo puedan
repasar y aplicar en sus proyectos.

## Sesiones

Cada sesión le suma una pieza a la forma en que trabajamos con IA. Al final
todas juntas forman el *harness* del equipo: las reglas, herramientas y
agentes que hacen que la IA trabaje mejor con nosotros.

| # | Fecha | Tema | Material |
|---|---|---|---|
| 1 | 2026-10-21 | Reglas y skills | [sesion-01](sesion-01/) |
| 2 | 2026-10-28 | Contexto: ventana, tokens, compactación y consumo | próximamente |
| 3 | 2026-11-04 | Desarrollo guiado por specs (SDD) | próximamente |
| 4 | 2026-11-11 | Subagentes | próximamente |
| 5 | 2026-11-18 | Harness completo y adopción | próximamente |

## Cómo está organizado

```text
sesion-01/
  README.md            Apuntes de la sesión: las ideas clave para repasar
  diapositivas.html    Las diapositivas (se abren en el navegador)
  diapositivas.pdf     Las mismas, en PDF
  demo/                El experimento con y sin configuración, para repetirlo
plantillas/
  AGENTS.md            Plantilla del archivo de reglas para su proyecto
  CLAUDE.md            Puente para Claude Code que importa AGENTS.md
  skill-ejemplo/       Ejemplo de cómo se ve una skill por dentro
```

Las diapositivas se abren con doble clic en `diapositivas.html`. Se avanza
con las flechas o la barra espaciadora; F11 para pantalla completa.

## Recursos

**Reglas**
- AGENTS.md, el formato abierto entre herramientas: https://agents.md
- Cómo usa Claude Code los archivos CLAUDE.md y AGENTS.md: https://code.claude.com/docs/en/memory

**Skills**
- Directorio de skills con buscador y número de instalaciones: https://skills.sh
- Skills oficiales de Anthropic: https://github.com/anthropics/skills
- Especificación abierta de Agent Skills: https://agentskills.io
- Skills en Codex: https://learn.chatgpt.com/docs/build-skills
- Buscar e instalar skills desde la terminal: `npx skills find <tema>` y `npx skills add <dueño/repo>`

**Herramientas**
- Claude Code: https://code.claude.com/docs
- Codex: https://developers.openai.com/codex

## Licencias

La skill `frontend-design` que se usa en la demo es de Anthropic y se
distribuye bajo Apache 2.0 (ver `LICENSE.txt` en su carpeta). El resto del
material es de los autores de la capacitación.
