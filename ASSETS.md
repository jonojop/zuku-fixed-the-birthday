# Assets personales

El juego funciona completamente con SVGs originales de reemplazo (fallbacks). Las imágenes reales de
esta lista son opcionales, pero cuando están presentes el juego las usa automáticamente.

## Carpeta de entrada

Colocá los archivos originales en:

```
assets-input/
```

Esa carpeta **nunca se publica tal cual** ni se sube a git (está en `.gitignore`): solo los archivos
reconocidos por nombre se copian a `public/assets/` mediante `scripts/sync-assets.mjs`, que corre
automáticamente antes de `npm run dev` y `npm run build`.

## Nombres y formatos reconocidos

El script busca archivos cuyo nombre **empiece** con estos prefijos (mayúsculas/minúsculas da igual),
con extensión `.png`, `.webp`, `.gif`, `.jpg` o `.jpeg`:

| Prefijo reconocido | Se usa en | Fallback si falta |
|---|---|---|
| `zuku-animated` o `zuku-character` | Nivel 04 — Rest Protocol (cabeza/avatar de Zuku, cuerpo en SVG) | Personaje SVG estilizado |
| `nala` | Celebración de Nala después de cada nivel | Perro SVG alegre con chapita "Nala" |
| `mani` | Nivel secreto MANI_ARCHIVE (exclusivo, no aparece antes) | Placeholder "Waiting for mani.png" |
| `handball-photo` | Nivel 03 — First Match (recuerdo desbloqueado) | No se muestra ninguna foto, solo el texto |
| `final-photo` | Pantalla final | No se muestra ninguna foto, solo el mensaje |

Ejemplos válidos: `zuku-animated.png`, `zuku-animated.gif`, `mani.jpg`, `nala.webp`.

Si hay más de un archivo que matchea el mismo prefijo, se usa el primero en orden alfabético y se
ignoran los demás (se registran en el manifiesto igual).

## Cómo se sincronizan

```bash
npm run sync-assets
```

Esto genera `public/assets/manifest.json` con qué se detectó para cada clave. La app lo lee en
runtime (`src/hooks/useAssetManifest.ts`) para decidir si mostrar la imagen real o el fallback SVG —
nunca rompe el juego si un archivo falta o no se puede leer.

Nada fuera de esta lista de nombres se copia ni se publica: cualquier otro documento que exista en
`assets-input/` (fotos personales sin ese nombre, capturas, etc.) se ignora por completo.

## Notas sobre la foto de Zuku

La foto entregada (`zuku-animated.png.jpg`) es una foto estática de alta resolución. Se integra como
avatar circular (cabeza) sobre un cuerpo dibujado en SVG/CSS, sin deformarla ni estirarla
(`object-fit`/`preserveAspectRatio` equivalentes). El cuerpo cambia de pose (parado → sentado) en el
nivel 4; la foto en sí se mantiene intacta en ambas poses.
