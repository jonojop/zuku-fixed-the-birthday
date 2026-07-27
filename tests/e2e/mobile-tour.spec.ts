import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { seedState } from './helpers'
import { LEVEL_ORDER } from '../../src/types/game'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const PREVIEW_DIR = path.resolve(dirname, '../../preview')

test.use({ viewport: { width: 390, height: 844 } })

test.describe('Mobile screenshots', () => {
  test('home screen', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Zuku Fixed the Birthday')).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-home-mobile.png') })
  })

  test('level screen', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'START' }).click()
    await expect(page.getByText(/LEVEL 0/)).toBeVisible({ timeout: 8000 })
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-level-mobile.png') })
  })

  test('rest protocol screen', async ({ page }) => {
    await seedState(page, {
      levelsCompleted: LEVEL_ORDER.slice(0, 3),
      currentLevelIndex: 3,
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'CONTINUE BUILD' }).click()
    await expect(page.getByText('LEVEL 04 // REST PROTOCOL')).toBeVisible({ timeout: 8000 })
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-rest-mobile.png') })
  })

  test('lemon pie screen', async ({ page }) => {
    await seedState(page, {
      levelsCompleted: LEVEL_ORDER.slice(0, 7),
      currentLevelIndex: 7,
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'CONTINUE BUILD' }).click()
    await expect(page.getByText('LEVEL 08 // LEMON PIE PROTOCOL')).toBeVisible({ timeout: 8000 })
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-lemon-pie-mobile.png') })
  })

  test('final screen', async ({ page }) => {
    await seedState(page, {
      levelsCompleted: [...LEVEL_ORDER],
      currentLevelIndex: 7,
      finalUnlocked: true,
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'CONTINUE BUILD' }).click()
    await expect(page.getByText('FELIZ CUMPLEAÑOS, ZUKU')).toBeVisible({ timeout: 10000 })
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-final-mobile.png') })
  })
})
