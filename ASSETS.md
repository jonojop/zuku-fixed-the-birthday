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
| `zuku-standing` | Nivel 04 — Rest Protocol, estado inicial (parado programando) | Placeholder de texto, sin silla ni escritorio dibujado |
| `zuku-sitting` | Nivel 04 — Rest Protocol, estado final tras el quinto fix (sentado, con silla incluida en la propia foto) | Placeholder de texto |
| `zuku-animated` o `zuku-character` | Sin uso actual (reservado; `zuku-standing`/`zuku-sitting` cubren el nivel 4) | — |
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

## Notas sobre las fotos de Zuku (nivel 4 — Rest Protocol)

`zuku-standing` y `zuku-sitting` son dos ilustraciones completas (escritorio, monitores, Nala y la
vista al Fuji ya incluidos en la propia imagen), no recortes de personaje para componer sobre un
fondo propio. Por eso el nivel **no dibuja ningún escritorio, monitor ni silla propios**: solo
muestra estas dos imágenes con `object-fit: contain` y hace un crossfade entre ellas cuando se
completa el quinto fix. La silla del estado final **ya está dentro de** `zuku-sitting` — el nivel no
crea, anima ni superpone ninguna silla adicional.
