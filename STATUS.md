# STATUS

Última actualización: 2026-07-27 (Polish V2).

## Fase actual

Completo. Polish V2 terminado sobre la rama `polish-v2`, listo para integrar a `main` y volver a
desplegar en el mismo GitHub Pages existente.

## Fases terminadas (V1)

1–9. Ver el historial de commits previos a esta actualización: fundación técnica, sistema visual,
los 8 niveles + secreto + final, celebraciones, accesibilidad/responsive, revisión visual, docs,
publicación inicial en GitHub Pages, y el primer rediseño de Rest Protocol (2 estados).

## Fases de Polish V2 (esta actualización)

1. **Distribución equilibrada de respuestas** — `gameContent.ts` ahora calcula la posición de la
   opción correcta con una secuencia balanceada determinista (`BALANCED_POSITIONS_BY_COUNT`,
   consumida en orden de definición), en vez del shuffle hash-based anterior que tendía a dejar la
   correcta al final. El shuffle en tiempo de render se sacó de `SimulatedEditor` — el orden ya viene
   resuelto y estable desde el contenido. Test dedicado (`answerDistribution.test.ts`) verifica que
   se usan las 4 posiciones, que la última no concentra mayoría, y que no se repite la misma posición
   más de dos veces seguidas.
2. **Sonido ampliado** — `sound.ts` reescrito con `playCorrect`, `playIncorrect`, `playDeployTick`,
   `playLevelComplete`, `playNalaTransition`, `playEngineRev` (motor de 2.5s para el reveal del R33),
   `playCandleIgnite`, `playCandlesBlow`, `playFinalCelebration`, `startFinalAmbientMusic`/
   `stopFinalAmbientMusic` (loop pentatónico chill generado con osciladores, sin archivos de audio).
   Cableado centralizado en `useFixSequence` (correct/incorrect) y `FixSequenceLevel`
   (level-complete), por lo que los niveles 1, 2, 3, 5, 6 y 7 lo heredan automáticamente.
3. **Assets nuevos** — `zuku-selfie`, `zuku-japan`, `nala-playing`, `nissan-r33`/`r33-reveal`
   agregados a `sync-assets.mjs` + `useAssetManifest.ts` + `ASSETS.md`, con test de sincronización
   actualizado.
4. **Rest Protocol V3 (reemplaza la V2 de dos estados)** — ahora son 3 estados: A) `zuku-selfie` +
   terminal de introducción + botón **START DEBUGGING**; B) `zuku-standing` durante los primeros 4
   fixes (HUD de notifications/brightness/autoSave/breakTimer, sin rebote vertical — solo un
   "breathing" de opacidad casi imperceptible); C) crossfade a `zuku-sitting` tras el 5º fix, con
   "Work session completed" y el mensaje final de siempre. **Ninguna silla propia en ningún estado**
   (verificado por test: cero elementos con clase que contenga "chair").
5. **Nala** — prioriza `nala-playing` sobre `nala` sobre el SVG fallback; chapita "Nala" visible
   también sobre la foto real; balanceo lateral + rebote suave (no se intentó un recorte de la cola
   por Pillow: no había forma de verificar que saliera limpio sin análisis de imagen, así que se usó
   el camino seguro que la propia spec habilita — animar la imagen completa en vez de arriesgar un
   recorte defectuoso).
6. **Level 1 Event Handler** — sello "DEPLOYED" animado + tick de sonido al completar.
7. **Level 2 CSS Recovery** — indicador BEFORE/AFTER, línea de "inspector" que barre la tarjeta y
   pulso verde en cada fix, transiciones con easing elástico (cubic-bezier con overshoot).
8. **Level 3 First Match** — cancha de handball rediseñada de cero: rectangular horizontal, arco
   izquierdo y arco derecho (nunca arriba/centro), áreas de 6m curvas, línea de 9m discontinua,
   círculos "Jono" (rojo) y "Zuku" (rosa) que empiezan separados y se encuentran en el centro al
   completar. Tests verifican arcos a izquierda/derecha, ausencia de arco superior, y las etiquetas
   correctas (nunca "Zuzu"/"Suku").
9. **Level 5 Travel Route** — tras los 4 fixes y "CONTINUE BUILD", escena intermedia cinematográfica
   con `zuku-japan` ("Narita arrival confirmed. Japan build unlocked.") antes de continuar al nivel 6.
10. **Level 6 Production Merge** — sin cambios de código: ya heredaba sonido/distribución/feedback
    del motor compartido.
11. **Level 7 Project R33** — tras los 5 fixes del SVG, reveal cinematográfico de la foto real
    `nissan-r33` con resplandor de "faros" y sonido de motor generado con Web Audio API.
12. **Level 8 Lemon Pie** — pie rediseñado con degradados/volumen/sombra de contacto/plato; las 26
    velas ya no son un grid separado: aparecen físicamente sobre la torta en 26 posiciones
    predeterminadas (3 anillos, generadas por fórmula determinista) a medida que se activan, cada una
    con llama animada; BLOW CANDLES apaga las llamas pero las 26 velas (apagadas) y la torta siguen
    visibles.
13. **Pantalla final** — fondo se oscurece al revelar el mensaje, globos ascendentes (respetan
    reduced-motion), tipografía (Space Grotesk local vía @fontsource, con tratamiento bold para
    títulos — se descartó Zen Kaku Gothic New por agregar ~1.5MB de glifos CJK para un uso puramente
    decorativo en texto latino), música ambiental chill + celebración sonora inicial, 9 logros con
    tooltip accesible (hover/focus/click, posición auto-ajustada para no salirse de pantalla — bug
    real encontrado y corregido durante la revisión visual mobile), botón "Inspect Build" con
    estética de terminal y cursor parpadeante.
14. **Capturas y revisión visual** — 21 capturas regeneradas (14 desktop + 10 mobile, algunas
    reemplazan nombres de la v1). Se encontraron y corrigieron 2 bugs reales durante la revisión:
    (a) el tooltip del primer logro se salía de pantalla en mobile — corregido con medición real vía
    `getBoundingClientRect` y clamping dentro del viewport; (b) los globos finales usaban
    `position: absolute` relativo a un contenedor más alto que el viewport, quedando fuera de vista —
    corregido a `position: fixed`.

## Assets personales detectados

| Clave | Archivo origen | Resultado |
|---|---|---|
| zuku-selfie | `zuku-selfie.png` (copia con nombre correcto del archivo entregado, mal nombrado por la herramienta de generación) | Estado A de Rest Protocol |
| zuku-standing | `zuku-standing.webp.png` | Estado B de Rest Protocol |
| zuku-sitting | `zuku-sitting.webp.png` | Estado C de Rest Protocol (silla incluida en la foto) |
| zuku-japan | `zuku-japan.png.png` | Reveal de Travel Route |
| nala-playing | `nala-playing.png.png` | Celebración de Nala (prioridad sobre `nala`) |
| nissan-r33 | `nissan-r33.png.jpg` | Reveal fotográfico de Project R33 |
| mani | `mani.png.jpg` | MANI_ARCHIVE |
| zuku-animated, zuku-character, nala, final-photo, handball-photo | no encontrados o sin uso actual | Fallbacks SVG/placeholder en uso |

## Último resultado de tests

- `npm run lint` → 0 errores, 2 warnings esperables (react-refresh en `GameContext.tsx`).
- `npm run test` (Vitest) → **57/57 tests pasando** en 15 archivos.
- `npm run test:e2e` (Playwright) → **11/11 tests pasando** (playthrough desktop completo con todos
  los reveals + 10 capturas mobile).
- `npm run build` → build exitoso. CSS bajó de 466KB a 35KB (7.5KB gzip) tras sacar el webfont CJK
  innecesario.

## Errores/advertencias pendientes (no bloqueantes)

- `npm audit`: mismas 5 vulnerabilidades "high" en una dependencia transitiva de ESLint
  (`brace-expansion`), documentadas desde V1 — solo-dev, riesgo real nulo, no se fuerza el upgrade a
  ESLint 10 sin necesidad concreta.

## Próximo paso exacto

Merge de `polish-v2` a `main`, push, esperar el workflow de GitHub Actions y verificar la misma URL
pública. Ningún otro paso obligatorio pendiente.

## Último commit

Ver `git log` en la rama `polish-v2` — pendiente de merge a `main` en esta misma sesión.

## Estado de GitHub

Repositorio existente: https://github.com/jonojop/zuku-fixed-the-birthday. Se trabajó en la rama
`polish-v2`; se integrará a `main` sin crear otro repositorio ni cambiar la URL pública.

## Estado del deploy

Pendiente de re-verificar tras el merge de `polish-v2` a `main` (mismo workflow, misma URL:
https://jonojop.github.io/zuku-fixed-the-birthday/).
