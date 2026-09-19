import { test, expect } from '@playwright/test';
import { PATH_LOGIN, PATH_HOME } from '@/config/const/paths';

test.describe('ログイン画面', () => {
  test('未入力で送信するとバリデーションエラーが表示される', async ({ page }) => {
    await page.goto(PATH_LOGIN);

    await page.getByRole('button', { name: 'ログイン', exact: true }).click();

    await expect(page.getByText('ログインIDを入力してください')).toBeVisible();
    await expect(page.getByText('パスワードを入力してください')).toBeVisible();
  });

  test('正しい認証情報でログインするとホームに遷移する', async ({ page }) => {
    const userLoginId = process.env.E2E_LOGIN_ID ?? 'test-user';
    const password = process.env.E2E_LOGIN_PASSWORD ?? 'password123';

    await page.goto(PATH_LOGIN);

    await page.getByLabel('ログインID').fill(userLoginId);
    await page.getByLabel('パスワード').fill(password);
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();

    await expect(page).toHaveURL(new RegExp(`${PATH_HOME}$`));
  });

  test('誤った認証情報でログインするとエラーメッセージが表示される', async ({ page }) => {
    await page.goto(PATH_LOGIN);

    await page.getByLabel('ログインID').fill('wrong-user');
    await page.getByLabel('パスワード').fill('wrong-password');
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();

    await expect(
      page.getByText('ログインIDまたはパスワードが正しくありません')
    ).toBeVisible();
  });
});
