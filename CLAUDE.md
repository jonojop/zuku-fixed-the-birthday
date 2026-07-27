# CLAUDE.md — Zuku Fixed the Birthday

Reglas permanentes para trabajar en este proyecto. Leé esto antes de tocar código.

## Identidad del proyecto (no negociable)

- Nombre exacto: **Zuku Fixed the Birthday**. Nunca "Suku". Si encontrás "Suku" en cualquier archivo,
  es un bug — corregilo.
- Carpeta raíz: `D:\ZukuFixedTheBirthday`. Repo: `zuku-fixed-the-birthday`.
- Protagonista: Nahuel, apodo Zuku, cumple 26 años. Regalo creado por Jonococina.
- Los 8 niveles y el nivel secreto (`MANI_ARCHIVE`) tienen nombres y cantidades de fixes fijas — ver
  `src/content/gameContent.ts`. **Rest Protocol: exactamente 5 fixes. Project R33: exactamente 5
  fixes. Lemon Pie Protocol: exactamente 26 velas.** Estos números están cubiertos por tests
  (`src/tests/content.test.ts`, `src/tests/gameReducer.test.ts`) — si cambian, los tests fallan a propósito.
- **Rest Protocol nunca tiene silla propia.** Ni SVG, ni CSS, ni un componente separado, en ningún
  estado (selfie/standing/sitting). La silla del estado final ya viene incluida en la foto
  `zuku-sitting`. Esto se pidió explícitamente dos veces por el usuario — es una regla absoluta, no
  una preferencia. `src/tests/RestProtocolLevel.test.tsx` falla si aparece cualquier clase que
  contenga "chair".

## Restricciones de gasto (no negociable)

Este proyecto es 100% gratuito, local y de código abierto. Nunca:
- Agregues una dependencia que requiera cuenta paga, API key facturable, o servicio de terceros.
- Uses `ANTHROPIC_API_KEY` ni Claude Console — este proyecto se desarrolla con el uso incluido de
  Claude Pro.
- Descargues fuentes, imágenes, sonidos o assets de un CDN como requisito de funcionamiento. Fuentes
  del sistema, SVG propios, audio generado con Web Audio API.

## Arquitectura

- Stack: Vite + React + TypeScript. Sin backend, sin base de datos, sin router (todo es un estado
  `phase` en `src/context/gameReducer.ts`).
- Contenido centralizado en `src/content/gameContent.ts` — no hardcodees texto del juego en componentes.
- Mecánica compartida: `src/hooks/useFixSequence.ts` + `src/components/FixSequenceLevel.tsx` cubren
  los niveles 1, 2, 3, 5, 6 y 7 (todos son "elegí la opción correcta entre varias"), y también los 4
  fixes de "estado B" de Rest Protocol. Cada nivel solo define su propia escena (`src/levels/*.tsx`).
  `FixSequenceLevel` acepta un `renderComplete` opcional para reemplazar el panel de "nivel completo"
  por una escena propia (usado por Travel Route y Project R33 para sus reveals fotográficos antes de
  disparar `COMPLETE_LEVEL`). El nivel 8 (velas) es bespoke porque su mecánica es distinta (26 toggles
  físicos sobre la torta + constructor de botón de 3 partes). Rest Protocol también es parcialmente
  bespoke: envuelve un estado local (`debuggingStarted`) alrededor de `FixSequenceLevel` para el
  estado A (selfie + START DEBUGGING) que antecede a los fixes.
- **Respuestas correctas**: nunca dependas de `optionIndex` para nada — el orden ya viene resuelto
  desde `gameContent.ts` (`placeCorrectOption`, secuencia balanceada determinista). Si agregás un
  fix nuevo con `fix(...)`, la posición de la opción correcta se calcula sola; no la fuerces a mano ni
  reintroduzcas un shuffle en `SimulatedEditor`.
- Sonido centralizado en `src/utils/sound.ts` (Web Audio API, sin archivos). Nombres estables:
  `playCorrect`, `playIncorrect`, `playDeployTick`, `playLevelComplete`, `playNalaTransition`,
  `playEngineRev`, `playCandleIgnite`, `playCandlesBlow`, `playFinalCelebration`,
  `startFinalAmbientMusic`/`stopFinalAmbientMusic`. `useFixSequence` y `FixSequenceLevel` ya disparan
  correct/incorrect/level-complete solos — no los vuelvas a llamar manualmente en un nivel que use
  ese hook.
- Persistencia: `src/context/persistence.ts`. `reviveState()` reconstruye campo por campo ante datos
  corruptos — nunca debe tirar el save entero por un solo campo inválido.
- Assets personales: `scripts/sync-assets.mjs` + `src/hooks/useAssetManifest.ts`. Nunca asumas que una
  imagen real existe — todo componente que la use debe tener un fallback SVG/placeholder funcional.
- **Tipografía**: solo `@fontsource/space-grotesk` (Latin, liviano). No reintroduzcas una fuente CJK
  completa (ej. Zen Kaku Gothic New) solo por estética "japonesa" en texto latino — ya se probó y
  agregaba ~450KB de CSS para cero beneficio real (ver `FINAL_REPORT.md`).

## Comandos

```bash
npm run dev             # desarrollo
npm run build            # build de producción (corre sync-assets antes)
npm run preview -- --port 4173
npm run lint
npm run test             # Vitest
npm run test:e2e          # Playwright (requiere test:e2e:install una vez)
```

## Criterios de calidad antes de dar algo por terminado

- `npm run lint`, `npm run test` y `npm run build` tienen que pasar sin errores.
- `npm run test:e2e` tiene que completar el flujo de los 8 niveles + secreto + final sin fallar.
- Sin scroll horizontal en ningún breakpoint (probado en 1440, 1366, 1024, 768, 390, 360).
- Todo fix tiene que ser resoluble con teclado y mouse/touch (son `<button>` reales, no `<div onClick>`).
- Todo componente animado tiene que respetar `prefers-reduced-motion` y el toggle manual
  "Omitir animaciones" (clase `.skip-animations` en `<html>`) — la regla global ya está en
  `src/styles/global.css`, no dupliques `@media (prefers-reduced-motion)` por componente salvo que el
  componente necesite un fallback estático explícito (ver `NalaCelebration.css`).

## Cómo continuar después de una pausa

1. Leé `STATUS.md` para saber la última fase completada y el próximo paso.
2. Corré `npm install`, `npm run lint`, `npm run test`, `npm run build` para confirmar que el estado
   guardado sigue siendo válido antes de seguir agregando features.
3. Si `git status` muestra cambios sin commitear, revisalos antes de continuar — no los descartes.
