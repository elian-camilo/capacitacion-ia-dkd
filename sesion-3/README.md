# Sesión 3: de la idea al código con SDD

[Diapositivas (PDF)](diapositivas.pdf) · [Diapositivas (HTML)](diapositivas.html)

## Qué vimos

1. **Lo que no le dicen, la IA lo adivina.** Un pedido de una línea deja preguntas abiertas (qué, para quién, qué pasa en los casos raros) y la IA las responde sola.
2. **SDD (desarrollo guiado por specs):** primero se escribe qué se quiere y cómo se sabe que quedó bien. El código va al final.
3. **Cuatro pasos:** idea, spec, plan y código. Los tres primeros se pueden hacer en el chat del navegador; el último, en Claude Code.
4. **La spec es el contrato.** Si algo cambia, primero se cambia la spec y después el código. Al final se revisa criterio por criterio, no a ojo.

## Los cuatro pasos

| Paso | Qué es | Quién |
|---|---|---|
| Idea | Una frase | Ustedes |
| Spec | El qué: problema, para quién, criterios de aceptación, qué no entra | La IA los entrevista, ustedes responden |
| Plan | El cómo: archivos, pasos, cómo se comprueba | La IA propone, ustedes corrigen y aprueban |
| Código | Implementar y revisar contra la spec | La IA hace, ustedes verifican |

En Claude Code, el modo plan (`Shift+Tab` hasta "plan mode") propone sin
tocar archivos. En el chat, pídanlo explícito: "no escribas código todavía".

## Prompt de entrevista

```
Quiero construir esto: <tu idea en una frase>.

Antes de escribir código, entrevístame. Hazme preguntas de una en una
hasta que tengas claro qué hay que hacer, para quién y cómo sabremos que
quedó bien. No propongas soluciones técnicas todavía.

Cuando termines, escribe la spec con esta estructura:
1. Problema: qué duele hoy.
2. Para quién.
3. Qué debe hacer.
4. Criterios de aceptación: lista que se pueda comprobar uno por uno.
5. Fuera de alcance: qué NO entra.
6. Dudas abiertas.
```

## Plantilla de spec

```markdown
# <Nombre>

## Problema
## Para quién
## Qué debe hacer
## Criterios de aceptación
- [ ] ...
## Fuera de alcance
## Dudas abiertas
```

## Prompt de plan

```
Esta es la spec: <pegar spec>.

No escribas código todavía. Propón un plan:
- qué archivos crearías o cambiarías,
- los pasos en orden, cada uno pequeño,
- cómo vas a comprobar cada criterio de aceptación,
- qué riesgos o dudas ves.
```

## ¿Su spec está lista?

1. ¿Cada criterio se comprueba con un sí o un no?
2. ¿Dice qué NO entra?
3. ¿Alguien que no estuvo en la conversación entendería qué hacer?
4. ¿Se termina en un día?

## Tarea

Terminen la spec de hoy, úsenla en una tarea real de la semana y
tráiganla a la sesión 4.

## Para leer más

- Buenas prácticas de Claude Code (explorar, planear, codificar): https://code.claude.com/docs/en/best-practices
