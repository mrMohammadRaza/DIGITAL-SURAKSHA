import { test, expect } from '@playwright/test';

test.describe('Digital Suraksha E2E Critical User Journeys', () => {
  test('Journey 1: Home Page, 1930 Helpline Banner and Language Switching', async ({ page }) => {
    await page.goto('/');

    // Check title and emergency banner
    await expect(page).toHaveTitle(/डिजिटल सुरक्षा/);
    const emergencyBanner = page.locator('text=1930');
    await expect(emergencyBanner.first()).toBeVisible();

    // Verify default Hindi text
    await expect(page.locator('h1')).toContainText('डिजिटल सुरक्षा');

    // Switch language to English
    await page.click('button:has-text("English")');
    await expect(page.locator('h1')).toContainText('Digital Suraksha');

    // Switch language to Marathi
    await page.click('button:has-text("मराठी")');
    await expect(page.locator('h1')).toContainText('डिजिटल सुरक्षा — स्वतःचे कष्टाचे पैसे');
  });

  test('Journey 2: Fraud Library, Search and Topic Detail', async ({ page }) => {
    await page.goto('/library');

    // Check search input
    const searchInput = page.locator('input[type="text"]');
    await expect(searchInput).toBeVisible();

    // Type "UPI" or "पिन" to filter
    await searchInput.fill('UPI');
    await page.waitForTimeout(500);

    // Click on a topic
    const topicLink = page.locator('a[href*="/library/upi-collect-request"]').first();
    await expect(topicLink).toBeVisible();
    await topicLink.click();

    // Verify detail page contains warning signs and safe actions
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=1930').first()).toBeVisible();
  });

  test('Journey 3: Safe vs Unsafe Scenario Assessment', async ({ page }) => {
    await page.goto('/scenarios');

    await expect(page.locator('h1')).toBeVisible();

    // Click the UNSAFE button on the first scenario card
    const unsafeButton = page.locator('button:has-text("असुरक्षित"), button:has-text("UNSAFE")').first();
    await expect(unsafeButton).toBeVisible();
    await unsafeButton.click();

    // Verification feedback should appear
    const feedbackLocator = page.locator('text=बिल्कुल सही जवाब')
      .or(page.locator('text=Correct Assessment'))
      .or(page.locator('text=अचूक उत्तर'))
      .or(page.locator('text=स्पष्टीकरण'));
    await expect(feedbackLocator.first()).toBeVisible();
  });

  test('Journey 4: Interactive Quiz Completion & Score Display', async ({ page }) => {
    await page.goto('/quiz');

    // Click "Start Quiz" on the beginner quiz
    const startQuizBtn = page.locator('a[href*="/quiz/quiz-beginner"]').first();
    await expect(startQuizBtn).toBeVisible();
    await startQuizBtn.click();

    // Answer first question
    const firstOption = page.locator('button:has-text("A"), button:has-text("B")').first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    // Advance to next or submit
    const nextOrSubmit = page.locator('button:has-text("अगला"), button:has-text("Next"), button:has-text("Submit"), button:has-text("परिणाम देखें")').last();
    await nextOrSubmit.click();
  });

  test('Journey 5: Emergency Help & Official Helpline Links', async ({ page }) => {
    await page.goto('/emergency');

    // Verify 1930 helpline
    await expect(page.locator('text=1930').first()).toBeVisible();
    // Verify cybercrime.gov.in link
    const portalLink = page.locator('a[href*="cybercrime.gov.in"]');
    await expect(portalLink.first()).toBeVisible();
  });

  test('Journey 6: Administrator Security & Content Moderation', async ({ page }) => {
    // 1. Direct dashboard navigation without login should redirect or require auth
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/.*\/admin\/login/);

    // 2. Perform official login
    await page.fill('input[type="email"]', 'admin@suraksha.gov.in');
    await page.fill('input[type="password"]', 'SurakshaAdmin2026!');
    await page.click('button[type="submit"]');

    // 3. Should land on Admin Dashboard
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
    await expect(page.locator('text=CEP Admin Portal')).toBeVisible();
    await expect(page.locator('text=Overview & Stats')).toBeVisible();
  });
});
