import { useEffect, useState } from 'react'

export type AssetKey = 'zuku-animated' | 'zuku-character' | 'nala' | 'mani' | 'final-photo' | 'handball-photo'

interface ManifestEntry {
  found: boolean
  publicPath?: string
}

type Manifest = Partial<Record<AssetKey, ManifestEntry>>

let cachedManifest: Manifest | null = null
let pendingFetch: Promise<Manifest> | null = null

async function loadManifest(): Promise<Manifest> {
  if (cachedManifest) return cachedManifest
  if (!pendingFetch) {
    pendingFetch = fetch(`${import.meta.env.BASE_URL}assets/manifest.json`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: { assets?: Manifest }) => {
        cachedManifest = data.assets ?? {}
        return cachedManifest
      })
      .catch(() => {
        cachedManifest = {}
        return cachedManifest
      })
  }
  return pendingFetch
}

/** Resolves a recognized personal asset to its public URL, or null if absent (use a fallback). */
export function useAsset(key: AssetKey): { url: string | null; loading: boolean } {
  const [manifest, setManifest] = useState<Manifest | null>(cachedManifest)

  useEffect(() => {
    if (manifest) return
    let active = true
    loadManifest().then((data) => {
      if (active) setManifest(data)
    })
    return () => {
      active = false
    }
  }, [manifest])

  if (!manifest) return { url: null, loading: true }
  const entry = manifest[key]
  if (entry?.found && entry.publicPath) {
    return { url: `${import.meta.env.BASE_URL}${entry.publicPath}`, loading: false }
  }
  return { url: null, loading: false }
}
