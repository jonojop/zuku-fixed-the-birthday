# STATUS

Última actualización: 2026-07-27.

## Fase actual

Completo. Las 9 fases están terminadas y el sitio está publicado y verificado en producción.

## Fases terminadas

1. Diagnóstico — carpeta, herramientas (node 24, npm 11, git 2.54, gh 2.96, gh autenticado como
   `jonojop`), sin `ANTHROPIC_API_KEY` configurada. `assets-input/` tenía `mani.png.jpg` y
   `zuku-animated.png.jpg` (ambas fotos estáticas JPEG, no animadas).
2. Fundación — Vite + React + TypeScript, ESLint (flat config), Vitest + Testing Library, Playwright,
   `vite.config.ts` con `base: '/zuku-fixed-the-birthday/'`.
3. Sistema visual — paleta japonesa, fondo SVG (Fuji/torii/luna/sakura), componentes comunes
   (LevelLayout, SimulatedEditor, ConsolePanel, ProgressBar, NalaCelebration, ConfirmModal,
   SoundButton, SkipAnimationButton, BootScreen).
4. Niveles — los 8 niveles jugables + nivel secreto `MANI_ARCHIVE` + pantalla final.
5. Celebraciones — NalaCelebration integrada después de cada nivel (con fallback SVG cuando no hay
   foto de Nala).
6. Calidad — accesibilidad (foco visible, aria-live, prefers-reduced-motion + toggle manual, focus
   trap en modales, todo resoluble con teclado), responsive (sin scroll horizontal en 1440/1366/1024/
   768/390/360, verificado con capturas reales).
7. Revisión visual — capturas generadas con Playwright, revisadas; se corrigió un bug real
   encontrado en la revisión (el alerón del R33 flotaba desconectado de la carrocería — corregido
   ancorándolo a un vértice conocido del path SVG y subiendo el contraste del cuerpo del auto).
8. Documentación — README, ASSETS, CLAUDE, STATUS, FINAL_REPORT.
9. Publicación — repo público creado, commits pusheados a `main`, GitHub Actions configurado y
   verificado en verde, GitHub Pages activo con `build_type: workflow`, sitio público verificado
   visualmente (screenshot + consola sin errores) en la URL real de producción.
10. Rediseño de Rest Protocol — reemplazado el escenario propio (escritorio/monitor/silla en SVG) por
    las dos ilustraciones reales `zuku-standing`/`zuku-sitting` entregadas (cada una ya es una escena
    completa, silla incluida en `zuku-sitting`). Se eliminó por completo cualquier silla propia del
    código. Los 5 fixes pasaron a ser `notifications`, `monitorBrightness`, `autoSave`, `breakTimer`
    y `onBreakComplete`, mostrados en un HUD de estado; el 5º fix dispara el crossfade parado→sentado
    y el mensaje "Work session completed".

## Assets personales detectados

| Clave | Archivo origen | Formato | ¿Animado? | Resultado |
|---|---|---|---|---|
| zuku-standing | `zuku-standing.webp.png` | PNG (1024×1024, ilustración completa) | No | Sincronizado a `public/assets/zuku-standing.png`, estado inicial del nivel Rest Protocol |
| zuku-sitting | `zuku-sitting.webp.png` | PNG (1024×1024, ilustración completa, silla incluida) | No | Sincronizado a `public/assets/zuku-sitting.png`, estado final tras el 5º fix de Rest Protocol |
| zuku-animated | `zuku-animated.png.jpg` | JPEG (1024×1024) | No (foto estática) | Sincronizado pero sin uso actual (superado por zuku-standing/zuku-sitting) |
| zuku-character | — | — | — | No encontrado, no aplica |
| nala | — | — | — | No encontrado, fallback SVG en uso |
| mani | `mani.png.jpg` | JPEG (447×447) | No | Sincronizado a `public/assets/mani.jpg`, usado en MANI_ARCHIVE |
| final-photo | — | — | — | No encontrado, fallback (no se muestra tarjeta) |
| handball-photo | — | — | — | No encontrado, fallback (no se muestra tarjeta) |

## Último resultado de tests

- `npm run lint` → 0 errores, 2 warnings esperables (react-refresh en el archivo de contexto, patrón
  estándar).
- `npm run test` (Vitest) → **35/35 tests pasando** (8 archivos: content, gameReducer, persistence,
  BootScreen, LemonPieLevel, NalaCelebration, App, RestProtocolLevel — este último verifica
  explícitamente que zuku-sitting solo aparece tras el 5º fix y que no existe ningún elemento con
  clase que contenga "chair" en el render).
- `npm run test:e2e` (Playwright, Chromium local) → **6/6 tests pasando**, incluyendo el playthrough
  completo (8 niveles + secreto + reset) y las 5 capturas mobile.
- `npm run build` → build exitoso (`dist/` ~244 KB JS, ~18 KB CSS antes de gzip).

## Errores/advertencias pendientes (no bloqueantes)

- `npm audit` reporta 5 vulnerabilidades "high" en una dependencia transitiva de ESLint
  (`brace-expansion` vía `minimatch`/`@eslint/config-array`), un DoS de expresión regular. Es una
  dependencia **solo de desarrollo** (ESLint nunca corre en producción ni procesa input de usuarios
  reales) — riesgo real: nulo para este proyecto. `npm audit fix --force` requeriría subir ESLint a
  la v10 (breaking change); no se aplicó para no arriesgar la configuración de lint sin necesidad real.

## Próximo paso exacto

No queda ningún paso obligatorio pendiente. Posibles próximos pasos opcionales, si se quiere seguir
iterando: agregar `zuku-character`, `nala`, `handball-photo` o `final-photo` a `assets-input/` para
reemplazar sus fallbacks SVG (no requiere tocar código), o revisar los 5 warnings de `npm audit`
(dependencia transitiva de ESLint, solo dev, ver abajo) si en algún momento se quiere subir ESLint a
la v10.

## Último commit

`ci: configure GitHub Pages deployment` (fix de orden de steps incluido) — ver `git log` para el hash
exacto; el repo remoto está actualizado hasta el mismo commit.

## Estado de GitHub

Repositorio público creado: https://github.com/jonojop/zuku-fixed-the-birthday — rama `main`
pusheada, working tree limpio.

## Estado del deploy

**Publicado y verificado.** Workflow `Deploy to GitHub Pages` en verde (lint + tests unitarios +
build + Playwright e2e + deploy). GitHub Pages activo (`build_type: workflow`). URL pública
verificada con una captura real y sin errores de consola:
https://jonojop.github.io/zuku-fixed-the-birthday/
