/// <reference types="node" />
import { describe, expect, it, beforeAll } from 'vitest'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
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
