import { expect, test } from '@playwright/test';

test('input has placeholder text', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('input')).toHaveAttribute('placeholder', 'test');
});
