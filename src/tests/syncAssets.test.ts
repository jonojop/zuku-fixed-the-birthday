/// <reference types="node" />
import { describe, expect, it, beforeAll } from 'vitest'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, renameSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

interface ManifestEntry {
  found: boolean
  publicPath?: string
}

let manifest: Record<string, ManifestEntry>

beforeAll(() => {
  execFileSync('node', ['scripts/sync-assets.mjs'], { cwd: projectRoot })
  const raw = readFileSync(path.join(projectRoot, 'public', 'assets', 'manifest.json'), 'utf-8')
  manifest = JSON.parse(raw).assets
})

describe('sync-assets', () => {
  const recognizedKeys = [
    'zuku-selfie',
    'zuku-standing',
    'zuku-sitting',
    'zuku-animated',
    'zuku-character',
    'zuku-japan',
    'nala-playing',
    'nala',
    'mani',
    'nissan-r33',
    'final-photo',
    'handball-photo',
  ]

  it('reports every recognized key, found or not', () => {
    for (const key of recognizedKeys) {
      expect(manifest).toHaveProperty(key)
      expect(typeof manifest[key].found).toBe('boolean')
    }
  })

  it('never fails when an asset is missing — it just reports found: false', () => {
    for (const key of recognizedKeys) {
      if (!manifest[key].found) {
        expect(manifest[key].publicPath).toBeUndefined()
      }
    }
  })

  it('gives every found asset a publicPath under assets/', () => {
    for (const key of recognizedKeys) {
      if (manifest[key].found) {
        expect(manifest[key].publicPath).toMatch(/^assets\//)
      }
    }
  })
})

describe('sync-assets on a CI-style checkout (assets-input absent)', () => {
  const inputDir = path.join(projectRoot, 'assets-input')
  const backupDir = path.join(projectRoot, 'assets-input.__test-backup__')
  let ciManifest: Record<string, ManifestEntry>

  beforeAll(() => {
    // assets-input is intentionally gitignored, so a fresh CI checkout never
    // has it. Previously-synced files in public/assets/ (which ARE committed
    // on purpose) must still be reported as found instead of the manifest
    // getting clobbered to "not found" just because the source folder is gone
    // this run — that regression broke the Rest Protocol e2e test on CI.
    if (existsSync(inputDir)) renameSync(inputDir, backupDir)
    try {
      execFileSync('node', ['scripts/sync-assets.mjs'], { cwd: projectRoot })
      const raw = readFileSync(path.join(projectRoot, 'public', 'assets', 'manifest.json'), 'utf-8')
      ciManifest = JSON.parse(raw).assets
    } finally {
      if (existsSync(backupDir)) renameSync(backupDir, inputDir)
      // Restore the real manifest (pointing at real source files again).
      execFileSync('node', ['scripts/sync-assets.mjs'], { cwd: projectRoot })
    }
  })

  it('still reports previously-synced assets as found', () => {
    for (const key of ['zuku-selfie', 'zuku-standing', 'zuku-sitting', 'zuku-japan', 'nala-playing', 'mani', 'nissan-r33']) {
      expect(ciManifest[key].found).toBe(true)
      expect(ciManifest[key].publicPath).toMatch(/^assets\//)
    }
  })
})
