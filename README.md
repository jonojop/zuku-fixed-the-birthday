# Zuku Fixed the Birthday

Una experiencia web interactiva de regalo de cumpleaños para **Nahuel ("Zuku")**, creada por **Jonococina**.

No es una tarjeta de cumpleaños: es un videojuego web corto de debugging. Una build especial destinada
a Zuku falló antes de poder desplegarse, y Zuku tiene que reparar 8 sistemas rotos —cada uno con una
mecánica y una escena distinta— hasta completar el deploy final.

Toda la experiencia ocurre dentro de la página: no hace falta abrir DevTools, una terminal real, ni
editar código. Los "fixes" se resuelven eligiendo la opción correcta entre varias, tocando elementos
visuales o construyendo piezas desde la propia interfaz.

## Qué es técnicamente

- SPA hecha con **Vite + React + TypeScript**, sin backend, sin base de datos, sin servicios de pago.
- Estado del juego con **React Context + useReducer**, persistido en `localStorage`.
- Estilos en CSS plano (variables + un archivo por componente), animaciones en CSS puro.
- Sonido generado 100% con **Web Audio API** (osciladores locales, no se descarga ningún archivo de audio).
- Ilustraciones en **SVG original** (no se usan imágenes descargadas de internet).
- Tests con **Vitest + React Testing Library** (unitarios/integración) y **Playwright** (end-to-end).

## Instalación

Requisitos: Node.js 20+ y npm.

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre la URL que imprime Vite (normalmente `http://localhost:5173/zuku-fixed-the-birthday/`).

Antes de `dev` y de `build` se ejecuta automáticamente `npm run sync-assets`, que copia las imágenes
personales reconocidas desde `assets-input/` hacia `public/assets/` (ver [ASSETS.md](./ASSETS.md)).

## Build de producción

```bash
npm run build
npm run preview -- --port 4173
```

`preview` sirve el build ya optimizado, exactamente como se comporta en producción (incluyendo el
`base` path usado para GitHub Pages).

## Tests

```bash
npm run lint          # ESLint
npm run test          # Vitest (unitarios + integración de componentes)
npm run test:e2e:install   # instala Chromium local para Playwright (una sola vez)
npm run test:e2e       # Playwright end-to-end (requiere el preview server; Playwright lo levanta solo)
```

Los tests end-to-end generan capturas reales de la aplicación en `preview/` (no son mockups).

## Cómo agregar las imágenes personales

Colocá los archivos con el nombre exacto esperado dentro de `assets-input/` (ver
[ASSETS.md](./ASSETS.md) para la lista completa de nombres y formatos soportados: la foto de Zuku, la
foto de Nala, la imagen de Mani, y las fotos de recuerdos). No hace falta tocar código: `sync-assets`
los detecta y los integra solo, con SVGs de reemplazo si todavía no existen.

## Cómo cambiar textos

Todo el contenido del juego —textos, niveles, fixes, pistas, mensajes de Nala, mensaje final— está
centralizado en [`src/content/gameContent.ts`](./src/content/gameContent.ts). No hace falta buscar
strings sueltos por los componentes.

## Cómo reiniciar el progreso

Desde la pantalla inicial o la pantalla final, botón **RESET PROGRESS** (pide confirmación). También
podés borrar manualmente la clave `zuku-fixed-the-birthday:v1` de `localStorage` desde el navegador.

## Estructura principal

```
src/
  components/   componentes reutilizables (layout de nivel, editor simulado, consola, modales...)
  content/      gameContent.ts — todo el texto y la configuración de niveles
  context/      estado global (reducer, persistencia)
  hooks/        useFixSequence (mecánica compartida), useAssetManifest
  levels/       un archivo por nivel + el nivel secreto
  styles/       variables globales, fondo japonés
  types/        tipos de TypeScript del juego
  tests/        tests unitarios y de integración (Vitest + RTL)
tests/e2e/       tests end-to-end (Playwright)
scripts/         sync-assets.mjs
preview/         capturas generadas por los tests e2e
```

## Despliegue

El sitio se publica gratuitamente en GitHub Pages vía GitHub Actions
(`.github/workflows/deploy.yml`), en cada push a `main`.

**URL publicada:** ver [FINAL_REPORT.md](./FINAL_REPORT.md) para el estado y la URL actual.
