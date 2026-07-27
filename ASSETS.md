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
| `zuku-selfie` | Nivel 04 — Rest Protocol, estado A (introducción, Zuku mirando a cámara) | Placeholder de texto, o `zuku-standing` con otro encuadre |
| `zuku-standing` | Nivel 04 — Rest Protocol, estado B (parado, primeros 4 fixes) | Placeholder de texto |
| `zuku-sitting` | Nivel 04 — Rest Protocol, estado C (sentado, tras el 5º fix, silla incluida en la propia foto) | Placeholder de texto |
| `zuku-animated` o `zuku-character` | Sin uso actual (reservado) | — |
| `zuku-japan` | Nivel 05 — Travel Route, escena de llegada a Japón tras Narita | No se muestra escena intermedia, se pasa directo al nivel 6 |
| `nala-playing` | Celebración de Nala después de cada nivel (prioridad sobre `nala`) | Ver `nala` |
| `nala` | Celebración de Nala si no existe `nala-playing` | Perro SVG alegre con chapita "Nala" |
| `mani` | Nivel secreto MANI_ARCHIVE (exclusivo, no aparece antes) | Placeholder "Waiting for mani.png" |
| `nissan-r33` o `r33-reveal` | Nivel 07 — Project R33, revelación fotográfica final tras los 5 fixes | No se muestra revelación fotográfica, el SVG construido queda como resultado final |
| `handball-photo` | Nivel 03 — First Match (recuerdo desbloqueado) | No se muestra ninguna foto, solo el texto |
| `final-photo` | Pantalla final | No se muestra ninguna foto, solo el mensaje |

Ejemplos válidos: `zuku-selfie.png`, `zuku-japan.gif`, `nala-playing.webp`, `nissan-r33.jpg`, `mani.jpg`.

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

`zuku-selfie`, `zuku-standing` y `zuku-sitting` son tres ilustraciones completas e independientes
(escritorio, monitores, Nala y la vista al Fuji ya incluidos en la propia imagen), no recortes de
personaje para componer sobre un fondo propio. Por eso el nivel **no dibuja ningún escritorio,
monitor ni silla propios**: solo muestra estas tres imágenes con `object-fit: contain`, cada una con
su propia clase de encuadre (`.zukuSelfie` / `.zukuStanding` / `.zukuSitting`), y hace un crossfade
entre ellas en dos transiciones (selfie→standing al presionar START DEBUGGING, standing→sitting tras
el 5º fix). La silla del estado final **ya está dentro de** `zuku-sitting` — el nivel no crea, anima
ni superpone ninguna silla adicional, en ningún estado.
