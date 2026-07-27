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
  los niveles 1, 2, 3, 4, 5, 6 y 7 (todos son "elegí la opción correcta entre varias"). Cada nivel solo
  define su propia escena SVG (`src/levels/*.tsx`). El nivel 8 (velas) es el único bespoke porque su
  mecánica es distinta (26 toggles + constructor de botón de 3 partes).
- Persistencia: `src/context/persistence.ts`. `reviveState()` reconstruye campo por campo ante datos
  corruptos — nunca debe tirar el save entero por un solo campo inválido.
- Assets personales: `scripts/sync-assets.mjs` + `src/hooks/useAssetManifest.ts`. Nunca asumas que una
  imagen real existe — todo componente que la use debe tener un fallback SVG funcional.

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
