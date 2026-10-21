---
name: revisar-pr
description: Revisa un cambio antes de abrir un PR en este equipo. Úsala cuando pidan "revisa esto", "está listo para PR" o antes de hacer commit de un cambio grande.
---

# Revisar antes de PR

Ejemplo de estructura de una skill. Cámbienla por un procedimiento real del
equipo; la descripción de arriba es lo que la IA lee para decidir si la
abre, así que tiene que decir qué hace y cuándo usarla.

## Pasos
1. Correr los tests y el lint del proyecto. Si algo falla, parar y reportarlo.
2. Revisar el diff completo: nombres, código muerto, secretos, `console.log` olvidados.
3. Confirmar que cada cambio de lógica tiene su test.
4. Resumir en 3 líneas qué cambió y por qué, listo para la descripción del PR.

## Nunca
- Hacer commit ni push por su cuenta.
