import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { seedState, solveFixesOnly } from './helpers'
import { LEVEL_ORDER, CANDLE_COUNT } from '../../src/types/game'

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

  test('Nala celebration transition', async ({ page }) => {
    await seedState(page, { skipAnimations: false })
    await page.goto('/')
    await page.getByRole('button', { name: 'START' }).click()
    await expect(page.getByText('LEVEL 01 // EVENT HANDLER')).toBeVisible({ timeout: 8000 })
    await solveFixesOnly(page, 'event-handler')
    await page.getByRole('button', { name: 'Continuar build' }).click()
    await expect(page.getByRole('status')).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-nala-transition-mobile.png') })
  })

  test('handball court', async ({ page }) => {
    await seedState(page, {
      levelsCompleted: [...LEVEL_ORDER.slice(0, 2)],
      currentLevelIndex: 2,
      skipAnimations: true,
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'CONTINUE BUILD' }).click()
    await expect(page.getByText('LEVEL 03 // FIRST MATCH')).toBeVisible({ timeout: 8000 })
    await solveFixesOnly(page, 'first-match')
    await expect(page.getByText('Acá empezó todo:')).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-handball-mobile.png') })
  })

  test('rest protocol screen', async ({ page }) => {
    await seedState(page, {
      levelsCompleted: [...LEVEL_ORDER.slice(0, 3)],
      currentLevelIndex: 3,
      skipAnimations: true,
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'CONTINUE BUILD' }).click()
    await expect(page.getByText('LEVEL 04 // REST PROTOCOL')).toBeVisible({ timeout: 8000 })
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-rest-mobile.png') })
  })

  test('Japan reveal', async ({ page }) => {
    await seedState(page, {
      levelsCompleted: [...LEVEL_ORDER.slice(0, 4)],
      currentLevelIndex: 4,
      skipAnimations: true,
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'CONTINUE BUILD' }).click()
    await expect(page.getByText('LEVEL 05 // TRAVEL ROUTE')).toBeVisible({ timeout: 8000 })
    await solveFixesOnly(page, 'travel-route')
    await page.getByRole('button', { name: 'CONTINUE BUILD' }).click()
    await expect(page.getByText('Narita arrival confirmed.')).toBeVisible()
    await page.waitForTimeout(300)
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-japan-reveal-mobile.png') })
  })

  test('R33 reveal', async ({ page }) => {
    await seedState(page, {
      levelsCompleted: [...LEVEL_ORDER.slice(0, 6)],
      currentLevelIndex: 6,
      skipAnimations: true,
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'CONTINUE BUILD' }).click()
    await expect(page.getByText('LEVEL 07 // PROJECT R33')).toBeVisible({ timeout: 8000 })
    await solveFixesOnly(page, 'project-r33')
    await page.getByRole('button', { name: 'Continuar build' }).click()
    await expect(page.getByText('PROJECT R33 — Build completed.')).toBeVisible()
    await page.waitForTimeout(300)
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-r33-reveal-mobile.png') })
  })

  test('lemon pie with 26 candles lit', async ({ page }) => {
    await seedState(page, {
      levelsCompleted: [...LEVEL_ORDER.slice(0, 7)],
      currentLevelIndex: 7,
      skipAnimations: true,
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'CONTINUE BUILD' }).click()
    await expect(page.getByText('LEVEL 08 // LEMON PIE PROTOCOL')).toBeVisible({ timeout: 8000 })
    const candles = page.getByRole('button', { name: /^Vela \d+/ })
    await expect(candles).toHaveCount(CANDLE_COUNT)
    for (let i = 0; i < CANDLE_COUNT; i++) {
      await candles.nth(i).click()
    }
    await expect(page.getByText(/All candles online/)).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-lemon-pie-26-mobile.png') })
  })

  test('final screen', async ({ page }) => {
    await seedState(page, {
      levelsCompleted: [...LEVEL_ORDER],
      currentLevelIndex: 7,
      finalUnlocked: true,
      skipAnimations: true,
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'CONTINUE BUILD' }).click()
    await expect(page.getByText('FELIZ CUMPLEAÑOS, ZUKU')).toBeVisible({ timeout: 10000 })
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-final-mobile.png') })
  })

  test('final screen achievement tooltip', async ({ page }) => {
    await seedState(page, {
      levelsCompleted: [...LEVEL_ORDER],
      currentLevelIndex: 7,
      finalUnlocked: true,
      skipAnimations: true,
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'CONTINUE BUILD' }).click()
    await expect(page.getByText('FELIZ CUMPLEAÑOS, ZUKU')).toBeVisible({ timeout: 10000 })
    const badge = page.getByRole('button', { name: 'System Starter' })
    await badge.click()
    await expect(page.getByText('Arrancaste la build y devolviste el control al sistema.')).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-final-tooltip-mobile.png') })
  })
})
