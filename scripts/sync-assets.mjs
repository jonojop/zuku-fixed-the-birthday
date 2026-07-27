// Sync recognized personal assets from /assets-input into /public/assets.
// Never touches originals, never publishes unrecognized files, never throws
// if something is missing — the site must always build with fallbacks.
import { readdirSync, existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SOURCE_DIR = join(ROOT, 'assets-input')
const OUTPUT_DIR = join(ROOT, 'public', 'assets')

const ALLOWED_EXT = new Set(['.png', '.webp', '.gif', '.jpg', '.jpeg'])

// key -> prefix regex (case-insensitive, matches the start of the filename)
const RECOGNIZED = {
  'zuku-selfie': /^zuku-selfie/i,
  'zuku-standing': /^zuku-standing/i,
  'zuku-sitting': /^zuku-sitting/i,
  'zuku-animated': /^zuku-animated/i,
  'zuku-character': /^zuku-character/i,
  'zuku-japan': /^zuku-japan/i,
  'nala-playing': /^nala-playing/i,
  nala: /^nala(?!-playing)/i,
  mani: /^mani/i,
  'nissan-r33': /^(nissan-r33|r33-reveal)/i,
  'final-photo': /^final-photo/i,
  'handball-photo': /^handball-photo/i,
}

function trueExtension(filename) {
  // Handles double extensions like "mani.png.jpg" -> real ext is the last one.
  return extname(filename).toLowerCase()
}

function run() {
  mkdirSync(OUTPUT_DIR, { recursive: true })

  const manifest = {
    generatedAt: new Date().toISOString(),
    assets: {},
  }

  let sourceFiles = []
  if (existsSync(SOURCE_DIR)) {
    sourceFiles = readdirSync(SOURCE_DIR, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => !name.startsWith('.'))
  }

  for (const [key, pattern] of Object.entries(RECOGNIZED)) {
    const candidates = sourceFiles
      .filter((name) => pattern.test(name))
      .filter((name) => ALLOWED_EXT.has(trueExtension(name)))
      .sort()

    if (candidates.length > 0) {
      const chosen = candidates[0]
      const ext = trueExtension(chosen)
      const outputName = `${key}${ext}`

      try {
        copyFileSync(join(SOURCE_DIR, chosen), join(OUTPUT_DIR, outputName))
        manifest.assets[key] = {
          found: true,
          sourceFile: chosen,
          publicPath: `assets/${outputName}`,
          extension: ext,
          animated: ext === '.gif',
          extraMatches: candidates.length > 1 ? candidates.slice(1) : undefined,
        }
        continue
      } catch (error) {
        manifest.assets[key] = { found: false, error: String(error?.message ?? error) }
        continue
      }
    }

    // Nothing in assets-input this run (e.g. a CI checkout, where that folder
    // is intentionally gitignored) — but if a previously-synced copy is still
    // sitting in public/assets/ (committed on purpose so the site can publish
    // it), keep reporting it as found instead of clobbering a working asset.
    const alreadySynced = [...ALLOWED_EXT].find((ext) => existsSync(join(OUTPUT_DIR, `${key}${ext}`)))
    if (alreadySynced) {
      manifest.assets[key] = {
        found: true,
        sourceFile: null,
        publicPath: `assets/${key}${alreadySynced}`,
        extension: alreadySynced,
        animated: alreadySynced === '.gif',
      }
    } else {
      manifest.assets[key] = { found: false }
    }
  }

  writeFileSync(join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))

  const summary = Object.entries(manifest.assets)
    .map(([key, info]) => {
      if (!info.found) return `  - ${key}: not found (fallback will be used)`
      return info.sourceFile ? `  - ${key}: OK (${info.sourceFile})` : `  - ${key}: OK (already synced, no source in assets-input this run)`
    })
    .join('\n')
  console.log(`[sync-assets] Recognized assets:\n${summary}`)
}

run()
