import { defineConfig } from '@playwright/test';
import { scryptSync } from 'node:crypto';
const database = process.env.TEST_DATABASE_URL;
if (!database) throw new Error('Set TEST_DATABASE_URL to a dedicated local PostgreSQL database.');
const url = new URL(database);
if (!['localhost', '127.0.0.1'].includes(url.hostname) || url.pathname !== '/portfolio_test') throw new Error('Tests only allow a local database named portfolio_test.');
const salt = '0123456789abcdef0123456789abcdef';
const password = 'Local-only-test-password!';
export default defineConfig({
  testDir: './tests', fullyParallel: false, workers: 1, timeout: 45_000,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:3100', channel: 'chrome', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: {
    command: 'pnpm start:standalone', url: 'http://127.0.0.1:3100/api/health', reuseExistingServer: false, timeout: 120_000,
    env: { DATABASE_URL: database, APP_URL: 'http://127.0.0.1:3100', PORT: '3100', HOSTNAME: '127.0.0.1', ADMIN_EMAIL: 'owner@example.test', ADMIN_PASSWORD_HASH: `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`, EMAIL_DELIVERY: 'disabled', READ_ONLY_MODE: 'false' },
  },
});
