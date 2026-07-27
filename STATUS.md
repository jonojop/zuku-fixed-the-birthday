# STATUS

Última actualización: 2026-07-27.

## Fase actual

Fase 9 — Publicación (en curso).

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
8. Documentación — README, ASSETS, CLAUDE, STATUS (este archivo).

## Assets personales detectados

| Clave | Archivo origen | Formato | ¿Animado? | Resultado |
|---|---|---|---|---|
| zuku-animated | `zuku-animated.png.jpg` | JPEG (1024×1024) | No (foto estática) | Sincronizado a `public/assets/zuku-animated.jpg`, usado como avatar en Rest Protocol |
| zuku-character | — | — | — | No encontrado, no aplica (zuku-animated ya cubre el nivel) |
| nala | — | — | — | No encontrado, fallback SVG en uso |
| mani | `mani.png.jpg` | JPEG (447×447) | No | Sincronizado a `public/assets/mani.jpg`, usado en MANI_ARCHIVE |
| final-photo | — | — | — | No encontrado, fallback (no se muestra tarjeta) |
| handball-photo | — | — | — | No encontrado, fallback (no se muestra tarjeta) |

## Último resultado de tests

- `npm run lint` → 0 errores, 2 warnings esperables (react-refresh en el archivo de contexto, patrón
  estándar).
- `npm run test` (Vitest) → **32/32 tests pasando** (7 archivos: content, gameReducer, persistence,
  BootScreen, LemonPieLevel, NalaCelebration, App).
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

Ejecutar la Fase 9 completa: revisar secretos, crear commits, crear el repositorio
`zuku-fixed-the-birthday` en GitHub, push, configurar GitHub Actions + Pages, verificar el workflow y
la URL pública. Actualizar este archivo y `FINAL_REPORT.md` con el resultado.

## Último commit

Pendiente (repositorio git recién inicializado en esta fase).

## Estado de GitHub

Repo aún no creado.

## Estado del deploy

Pendiente.
