import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { PROJECT, LEVELS } from '../../src/content/gameContent'
import { createInitialState } from '../../src/context/gameReducer'
import type { GameState, LevelId } from '../../src/types/game'

export async function seedState(page: Page, partial: Partial<GameState>) {
  const state: GameState = { ...createInitialState(), ...partial }
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: PROJECT.storageKey, value: JSON.stringify(state) }
  )
}

export async function waitForLevelScreen(page: Page) {
  await expect(page.getByText(/LEVEL 0/)).toBeVisible({ timeout: 8000 })
}

/** Solves every fix of the shared multiple-choice mechanic (levels 1-7) without
 *  advancing past the level-complete panel, so callers can screenshot first. */
export async function solveFixesOnly(page: Page, levelId: LevelId) {
  const level = LEVELS.find((l) => l.id === levelId)
  if (!level) throw new Error(`Unknown level ${levelId}`)

  for (const fix of level.fixes) {
    const correct = fix.options.find((o) => o.correct)
    if (!correct) throw new Error(`Fix ${fix.id} has no correct option`)
    await page.getByRole('button', { name: correct.label, exact: true }).click()
    await page.waitForTimeout(150)
  }
}

/** Clicks through the level-complete panel and the Nala celebration that follows it. */
export async function advanceAfterLevel(page: Page) {
  await page.getByRole('button', { name: 'Continuar build' }).click()
  await page.getByRole('button', { name: 'Continuar build' }).click()
}

/** Convenience wrapper for levels where no mid-level screenshot is needed. */
export async function solveGenericLevel(page: Page, levelId: LevelId) {
  await solveFixesOnly(page, levelId)
  await advanceAfterLevel(page)
}
