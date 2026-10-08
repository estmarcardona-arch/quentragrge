import { test, expect } from '@playwright/test';

test.describe('Autenticación y Sesión', () => {
  test('Login incorrecto muestra error genérico', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'noexiste@grufarcol.com');
    await page.fill('input[type="password"]', 'mala_clave');
    await page.click('button[type="submit"]');

    await expect(page.locator('.text-destructive')).toBeVisible();
    await expect(page.getByText('Credenciales inválidas o cuenta bloqueada.')).toBeVisible();
  });

  // El login correcto asume que el backend está corriendo y el usuario master existe.
  // Podríamos mockear esto o ejecutarlo si Supabase local está corriendo.
  test('Login correcto redirige al inicio', async () => {
    // Para entornos locales donde ya se ejecutó la semilla
    // await page.goto('/login');
    // await page.fill('input[type="email"]', 'admin@grufarcol.com');
    // await page.fill('input[type="password"]', 'Desarrollo123!');
    // await page.click('button[type="submit"]');
    // await expect(page).toHaveURL(/.*\/inicio/);
    // await expect(page.getByText('Dashboard Principal')).toBeVisible();
  });
});
