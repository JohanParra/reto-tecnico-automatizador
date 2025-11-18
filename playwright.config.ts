import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './tests/specs',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { outputFolder: 'reports/html', open: 'never' }],
        ['json', { outputFile: 'reports/json/results.json' }],
        ['list'],
        ['junit', { outputFile: 'reports/junit/results.xml' }]
    ],
    use: {
        baseURL: process.env.API_BASE_URL || 'https://guias-service-test.coordinadora.com',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    },
    timeout: 60000,
    expect: {
        timeout: 10000
    },
    projects: [
        {
            name: 'api-tests',
            testMatch: '**/*.spec.ts',
        }
    ],
    outputDir: 'test-results/',
});

