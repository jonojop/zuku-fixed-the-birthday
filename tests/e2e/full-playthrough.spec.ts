import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LEMON_PIE_CONTENT } from '../../src/content/gameContent'
import { CANDLE_COUNT } from '../../src/types/game'
import { solveFixesOnly, advanceAfterLevel, waitForLevelScreen } from './helpers'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const PREVIEW_DIR = path.resolve(dirname, '../../preview')

test.use({ viewport: { width: 1440, height: 900 } })

test.describe('Full playthrough (desktop)', () => {
  test('completes all 8 levels, the secret archive and the final deploy', async ({ page }) => {
    test.setTimeout(120_000)

    await page.goto('/')
    await expect(page.getByText('Zuku Fixed the Birthday')).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-home-desktop.png') })

    await page.getByRole('button', { name: 'START' }).click()
    await waitForLevelScreen(page)
    await expect(page.getByText('LEVEL 01 // EVENT HANDLER')).toBeVisible()

    await solveFixesOnly(page, 'event-handler')
    await expect(page.locator('.level-complete-title')).toContainText('Event system restored.')
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-level1-complete-desktop.png') })
    await page.getByRole('button', { name: 'Continuar build' }).click()
    await expect(page.getByRole('status')).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-nala-transition-desktop.png') })
    await page.getByRole('button', { name: 'Continuar build' }).click()

    await expect(page.getByText('LEVEL 02 // CSS RECOVERY')).toBeVisible()
    await solveFixesOnly(page, 'css-recovery')
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-css-recovery-desktop.png') })
    await advanceAfterLevel(page)

    await expect(page.getByText('LEVEL 03 // FIRST MATCH')).toBeVisible()
    await solveFixesOnly(page, 'first-match')
    await expect(page.getByText('Acá empezó todo:')).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-handball-desktop.png') })
    await advanceAfterLevel(page)

    await expect(page.getByText('LEVEL 04 // REST PROTOCOL')).toBeVisible()
    await page.getByRole('button', { name: 'START DEBUGGING' }).click()
    await expect(page.getByAltText('Zuku programando de pie, de espaldas')).toBeVisible({ timeout: 5000 })
    await solveFixesOnly(page, 'rest-protocol')
    await expect(page.locator('.rest-session-caption')).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-rest-correct-desktop.png') })
    await advanceAfterLevel(page)

    await expect(page.getByText('LEVEL 05 // TRAVEL ROUTE')).toBeVisible()
    await solveFixesOnly(page, 'travel-route')
    await page.getByRole('button', { name: 'CONTINUE BUILD' }).click()
    await expect(page.getByText('Narita arrival confirmed.')).toBeVisible()
    await page.waitForTimeout(1300) // let the cinematic fade-in/brightness reveal finish
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-japan-reveal-desktop.png') })
    await advanceAfterLevel(page)

    await expect(page.getByText('LEVEL 06 // PRODUCTION MERGE')).toBeVisible()
    await solveFixesOnly(page, 'production-merge')
    await advanceAfterLevel(page)

    await expect(page.getByText('LEVEL 07 // PROJECT R33')).toBeVisible()
    await solveFixesOnly(page, 'project-r33')
    await expect(page.locator('.r33-caption')).toBeVisible()
    await page.getByRole('button', { name: 'Continuar build' }).click()
    await expect(page.getByText('PROJECT R33 — Build completed.')).toBeVisible()
    await page.waitForTimeout(1300) // let the cinematic fade-in + headlight glow finish
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-r33-reveal-desktop.png') })
    await advanceAfterLevel(page)

    await expect(page.getByText('LEVEL 08 // LEMON PIE PROTOCOL')).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-lemon-pie-zero-desktop.png') })

    const candles = page.getByRole('button', { name: /^Vela \d+/ })
    await expect(candles).toHaveCount(CANDLE_COUNT)
    for (let i = 0; i < CANDLE_COUNT; i++) {
      await candles.nth(i).click()
    }
    await expect(page.getByText(/All candles online/)).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-lemon-pie-26-desktop.png') })

    const textPart = LEMON_PIE_CONTENT.buttonParts.text.find((o) => o.correct)!
    const eventPart = LEMON_PIE_CONTENT.buttonParts.event.find((o) => o.correct)!
    const actionPart = LEMON_PIE_CONTENT.buttonParts.action.find((o) => o.correct)!
    await page.getByRole('button', { name: textPart.label, exact: true }).click()
    await page.getByRole('button', { name: eventPart.label, exact: true }).click()
    await page.getByRole('button', { name: actionPart.label, exact: true }).click()

    await page.getByRole('button', { name: 'BLOW CANDLES' }).click()
    await expect(page.locator('.pie-caption')).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-lemon-pie-extinguished-desktop.png') })
    await advanceAfterLevel(page)

    await expect(page.getByText('DEPLOY SUCCESSFUL')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('FELIZ CUMPLEAÑOS, ZUKU')).toBeVisible({ timeout: 5_000 })
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-final-celebration-desktop.png') })

    // Achievement tooltip, revealed by hovering/focusing one of the badges.
    const firstAchievement = page.getByRole('button', { name: 'System Starter' })
    await firstAchievement.focus()
    await expect(page.getByText('Arrancaste la build y devolviste el control al sistema.')).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-final-tooltip-desktop.png') })

    // Secret level, discreetly hinted at from the final screen.
    await page.getByRole('button', { name: /Inspect build/ }).click()
    await expect(page.locator('.secret-archive-code')).toBeVisible()
    const maniImage = page.getByAltText('Mani, de La Era de Hielo')
    const maniPlaceholder = page.getByText('Waiting for mani.png')
    await expect(maniImage.or(maniPlaceholder)).toBeVisible()
    await page.screenshot({ path: path.join(PREVIEW_DIR, 'preview-inspect-build-desktop.png') })
    await page.getByRole('button', { name: 'Volver al deploy final' }).click()
    await expect(page.getByText('FELIZ CUMPLEAÑOS, ZUKU')).toBeVisible()

    // Reset requires explicit confirmation and returns to a fresh START.
    await page.getByRole('button', { name: 'RESET PROGRESS' }).click()
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await page.getByRole('button', { name: 'Sí, reiniciar' }).click()
    await expect(page.getByRole('button', { name: 'START' })).toBeVisible()
  })
})
